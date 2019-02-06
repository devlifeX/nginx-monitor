const sh = require("shelljs");
const os = require("os");

const NGINX = url => {
  const getNginxStatus = () => {
    const { stdout, stderr, code } = sh.exec(`curl ${url}`, {
      silent: true
    });

    return stdout;
  };

  const getActiveConnections = () => {
    const log = getNginxStatus();
    return log.match(/(\d+)/g)[0];
  };

  return {
    getActiveConnections
  };
};

const CPU = () => {
  //Create function to get CPU information
  function cpuAverage() {
    //Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0,
      totalTick = 0;
    var cpus = os.cpus();

    //Loop through CPU cores
    for (var i = 0, len = cpus.length; i < len; i++) {
      //Select CPU core
      var cpu = cpus[i];

      //Total up the time in the cores tick
      for (type in cpu.times) {
        totalTick += cpu.times[type];
      }

      //Total up the idle time of the core
      totalIdle += cpu.times.idle;
    }

    //Return the average Idle and Tick times
    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
  }

  function getCpuAverage() {
    var startMeasure = cpuAverage();
    var promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        var endMeasure = cpuAverage();
        //Calculate the difference in idle and total time between the measures
        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;

        //Calculate the average percentage CPU usage
        var p = 100 - ~~((100 * idleDifference) / totalDifference);
        resolve(p);
      }, 100);
    });
    return promise;
  }

  return {
    getCpuAverage
  };
};

const IO = () => {
  let file,
    content = "";
  const create = () => {
    let header = `Connections | Cpu Usage | Date\n`;
    sh.exec(`echo "${header + this.content}" > ${this.file}`, {
      silent: false
    });
  };

  const isExist = () => {
    const { stdout, stderr, code } = sh.exec(`ls ${this.file}`, {
      silent: true
    });
    return stderr ? false : true;
  };

  const append = () => {
    sh.exec(`echo "${this.content}" >> ${this.file}`, {
      silent: false
    });
  };

  const add = (file, content) => {
    this.file = file;
    this.content = content;
    return isExist() ? append() : create();
  };

  return {
    add
  };
};

const createLog = async url => {
  let connections = NGINX(url).getActiveConnections();
  let cpuUsage = await CPU().getCpuAverage();
  let content = `${connections} | ${cpuUsage}% | ${new Date()}`;
  IO().add("server.log", content);
};

const cli = () => {
  let argv = process.argv;
  const NEXT = 1;
  let url = argv[argv.indexOf("--url") + NEXT];
  let interval = argv[argv.indexOf("--i") + NEXT];

  setInterval(() => {
    createLog(url);
  }, interval);
};

cli();

// nodejs app.js --url "--user dariushvesal:13711369 -L https://apl1.nabzino.com/nginx_status" --i 2000
