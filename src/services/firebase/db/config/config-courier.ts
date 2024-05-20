import * as Types from '../types';
import { getDbRecord } from '../db';

export const getConfig: () => Promise<Types.IConfig> = () => getDbRecord<Types.IDbConfig, Types.IConfig>('/config', (data) => {
	return {
		smsApi: data.sms_api,
		mailUrl: data.mail_url,
		apiUrl: data.api_url,
		transportCostPerMinute: data.transport_cost_per_minute,
		transportCostMinimum: data.transport_cost_minimum,
		transportHourBase: data.transport_hour_base
	}
});