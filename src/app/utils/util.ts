export const compareVersion = (version1: string, version2: string) => {
  const v1 = version1.split('.');
  const v2 = version2.split('.');
  const length = Math.max(v1.length, v2.length);

  for (let i = 0; i < length; i++) {
    const num1 = parseInt(v1[i] || '0', 10);
    const num2 = parseInt(v2[i] || '0', 10);
    if (num1 > num2)
      return 1;
    if (num1 < num2)
      return -1;
  }
  return 0;
}

export const parseVersion = (version: string) => 
  version.replace(/([A-Z])\w+/g,'').replace(/\[/g,'').replace(/\)/g,'');

export const compare = (rangeVersion: string | null, bootVersion: string | undefined) => {
  if (!bootVersion || !rangeVersion) return null;
  const boot = bootVersion.replace(/([A-Z-])\w+/g, '');
  const range = rangeVersion.split(',');
  
  if (range.length > 1) {
    let firstRange = '';
    const num1 = parseVersion(rangeVersion.split(',')[0]);
    const num2 = parseVersion(rangeVersion.split(',')[1]);
    if (range[0].includes('[')) {
      firstRange = range[0].replace('[', '>= ');
    }
    if (range[0].includes('(')) {
      firstRange = range[0].replace('(', '> ');
    }

    let lastRange = '';
    if (range[1].includes(']')) {
      lastRange = `<= ${range[1].replace(']', '')}`;
    }
    if (range[1].includes(')')) {
      lastRange = `< ${range[1].replace(')', '')}`;
    }
    if (compareVersion(boot, num1) > 0 && compareVersion(boot, num2) < 0 ){
      return null;
    } else {
      return `${firstRange} and ${lastRange}`;
    }
  } else {
    let vRange = '';
    const num1 = parseVersion(rangeVersion.split(',')[0]);
    if (range[0].includes('[')) {
      vRange = range[0].replace('[', '>= ');
    }
    if (range[0].includes('(')) {
      vRange = range[0].replace('(', '> ');
    }
    if (range[0].includes(']')) {
      vRange = range[0].replace(']', '<= ');
    }
    if (range[0].includes(')')) {
      vRange = range[0].replace(')', '< ');
    }
    if (!range[0].match(/\[|\(|\]|\)/g)) {
      vRange = `>= ${range[0]}`;
    }
    if (compareVersion(boot, num1) > 0 ){
      return null;
    } else {
      return `${vRange}`;
    }
  }
}