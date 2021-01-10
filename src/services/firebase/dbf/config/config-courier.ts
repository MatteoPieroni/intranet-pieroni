import * as Types from '../../types';
import { GetDbRecord } from '../../db';

export const getConfig: Types.GetDbObject = () => GetDbRecord('/config', (data: Types.IDbConfig) => {
	return {
		smsApi: data.sms_api
	}
});