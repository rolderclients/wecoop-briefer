import { checkEnv } from './checkEnv';

const [stage] = process.argv.slice(2); // убираем первые два элемента (путь к bun и скрипту)

const stages = ['init', 'dev', 'test', 'prod'];
if (!stages.includes(stage)) {
	console.error(
		`\nInvalid stage: "${stage}", supported stages are: ${stages.join(', ')}`,
	);
	process.exit(0);
}

checkEnv();

const proc = Bun.spawn(['bun', 'sst', 'deploy', '--stage', stage], {
	stdio: ['inherit', 'inherit', 'inherit'],
});

await proc.exited;
