import * as Types from '../../types';
import { GetDbRecord } from '../../db';

export const getConfig: Types.GetDbObject = () => GetDbRecord<Types.IDbConfig, Types.IConfig>('/config', (data) => {
	return {
		smsApi: data.sms_api,
		mailUrl: data.mail_url,
	}
});