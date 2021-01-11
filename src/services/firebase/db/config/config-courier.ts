import * as Types from '../types';
import { getDbRecord } from '../db';

export const getConfig: () => Promise<Types.IConfig> = () => getDbRecord<Types.IDbConfig, Types.IConfig>('/config', (data) => {
	return {
		smsApi: data.sms_api,
		mailUrl: data.mail_url,
	}
});