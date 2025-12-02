import type { Output } from '@pulumi/pulumi';
import { env } from '../env';
import type { Stage } from '../types';

export const getCloudflareDns = (cname: Output<string>) => {
	const { appName, projectName, subDomain } = env;

	const zoneId = process.env.CLOUDFLARE_ZONE_ID;
	if (!zoneId)
		throw new Error('CLOUDFLARE_ZONE_ID environment variable is not set');

	return new cloudflare.DnsRecord(`${projectName}-${appName}`, {
		zoneId,
		name: subDomain[$app.stage as Stage],
		type: 'CNAME',
		content: cname,
		ttl: 1,
	});
};
