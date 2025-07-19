/* eslint-disable no-undef */
/**
 * Properties injected on kApi Build:
 *
 * EVENTS
 * { name: string, file: string }
 *
 * CURRENT_PLUGIN_VERSION
 * string
 *
 * API_ENDPOINT
 * string
 */

import BasePlugin from './base-plugin.js';
import axios from 'axios';

export default class KOTHPlugin extends BasePlugin {
  static get description() {
    return 'Enable Shared Economy';
  }

  static get defaultEnabled() {
    return true;
  }

  static get optionsSpecification() {
    return {
      apiToken: {
        required: true,
        description: 'KOTH Api Token',
        default: 'YOUR_ACCESS_TOKEN',
      },
      apiEndpoint: {
        required: false,
        description:
          'KOTH Api Endpoint (If you want to have your own private or local economy)',
        default: null,
      },
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);
    this.host = options.apiEndpoint ?? API_ENDPOINT;
  }

  getHeaders() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.options.apiToken}`,
    };
  }
  async compareVersions(version1, version2) {
    const v1Parts = version1.replace('v', '').split('.').map(Number);
    const v2Parts = version2.replace('v', '').split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1 = v1Parts[i] || 0;
      const v2 = v2Parts[i] || 0;

      if (v1 > v2) return 1;
      if (v1 < v2) return -1;
    }

    return 0;
  }

  async checkForUpdates() {
    const versionEndpoint = `${API_ENDPOINT}/plugin/version`;
    const vResponse = await axios({
      url: versionEndpoint,
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (vResponse.status != 200) {
      this.verbose(1, 'Unable to check latest version');
      return;
    }
    const comparisonResult = await this.compareVersions(
      CURRENT_PLUGIN_VERSION,
      vResponse.data.data,
    );
    if (comparisonResult < 0) {
      // New Version Available
    } else if (comparisonResult > 0) {
      // On Pre-Release
    } else if (comparisonResult == 0) {
      // Running Latest
    } else {
      // Something went Wrong
    }
  }

  async update() {
    const downloadEndpoint = `${API_ENDPOINT}/plugin/download`;
    const response = await axios({
      url: downloadEndpoint,
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (response.status != 200) {
      this.verbose(1, 'Unable to check latest version');
      return;
    }
  }

  async mount() {
    this.verbose(1, 'Mount');
  }

  async unmount() {
    this.verbose(1, 'Unmount');
  }
}
