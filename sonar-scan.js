const scanner = require('sonarqube-scanner');
const pkj = require('./package.json');

const serverUrl = 'https://sonar.synchronoss.net/';
const projectKeyName = pkj.name.replace('oasis-', 'oasis:');

const options = {
  'sonar.projectKey': projectKeyName,
  'sonar.projectName': projectKeyName,
  'sonar.projectVersion': pkj.version,
  'sonar.sourceEncoding': 'UTF-8',
  'sonar.lang.patterns.ts': '**/*.ts,**/*.tsx',
  'sonar.sources': './src',
  'sonar.exclusions':
    '**/node_modules/**,**/*.spec.ts,**/*.mock.ts,**/*.html,**/*.scss,**/*.json,**/*.sass,**/src/app/**,**/src/index.ts,**/src/components/index.ts',
  'sonar.tests': './__tests__',
  'sonar.test.inclusions': '**/*.test.ts',
  'sonar.typescript.tsconfigPath': 'tsconfig.json',
  'sonar.typescript.lcov.reportPaths': './coverage/lcov.info',
  'sonar.testExecutionReportPaths': './coverage/test-reporter.xml',
  'sonar.host.url': serverUrl,
  'sonar.verbose': process.env.SONAR_SCAN_VERBOSE ?? 'false',
};

printStep('Start SonarQube scan');

scanner({ serverUrl, options }, () => {
  printStep('Finish SonarQube scan');
  process.exit();
});

function printStep(msg) {
  console.log('*********************************************');
  console.log(msg);
  console.log('*********************************************');
}
