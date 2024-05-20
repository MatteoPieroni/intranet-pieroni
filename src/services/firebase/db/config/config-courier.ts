import * as Types from '../types';
import { getDbRecord, updateRecord } from '../db';

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
export const updateConfig: (ids: keyof Types.IConfig, data: Types.IConfig) => Promise<Types.IDbConfig> = async (id, data) => await updateRecord<Types.IDbConfig>('/config', id, data);
