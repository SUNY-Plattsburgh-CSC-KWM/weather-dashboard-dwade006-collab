const pData = {
    temp: "",
    time: "",
    lat: "",
    long: "",
    timezone: "",
    pProb: "",
    wCond: "",
    is_Day: "",
}

async function GetForecast(latitude, longitude) {
    console.log("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m,precipitation_probability,weather_code,is_day&timezone=auto")
    try {

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weather_code,is_day&timezone=auto`);
        if (!response.ok) {
            throw new Error("error fetching data" + error);
        }
        const forecast = await response.json();
        return forecast;
    }
    catch (error) {
        console.log(error);
    }
}
async function GetPastData(latitude, longitude) {
    var date = new Date();
    var isoDate = date.toISOString();
    console.log("https://archive-api.open-meteo.com/v1/archive?latitude=" + latitude + "&longitude=" + longitude + "&start_date=2025-11-09&end_date="+ isoDate.substring(0,10) +"&hourly=temperature_2m,weather_code,is_day,precipitation&timezone=auto")
    try {
        const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2025-11-09&end_date=${isoDate.substring(0,10)}&hourly=temperature_2m,weather_code,is_day,precipitation&timezone=auto`);
        if (!response.ok) {
            throw new Error("error fetching data" + error);
        }
        const past = await response.json();
        return past;
    }
    catch (error) {
        console.log(error);
    }
}

async function processGetForecastData(latitude, longitude) {
    let deg = prompt("F or C?")
    let DataArr = []
    try {
        let data = await GetForecast(latitude, longitude);
        for (let i = 0; i < data.hourly.time.length; i++) {
            let wData = Object.create(pData);
            wData.lat = data.latitude.toString();
            wData.long = data.longitude.toString();
            wData.timezone = data.timezone;
            if (deg == 'C') {
                wData.temp = data.hourly.temperature_2m[i].toString();
            }
            else if (deg == 'F') {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
                wData.temp = Math.trunc((data.hourly.temperature_2m[i] * 9 / 5) + 32).toString();
            }
            else {
                console.log("Misinput detected, using Celsius by default");
                wData.temp = data.hourly.temperature_2m[i].toString();
            }
            wData.time = data.hourly.time[i];
            wData.pProb = data.hourly.precipitation_probability[i].toString();
            wData.is_Day = data.hourly.is_day[i];
            if (data.hourly.weather_code[i] <= 49 && data.hourly.is_day[i] == 1) {
                wData.wCond = `<i class="wi wi-day-sunny"></i>`;
            }
            if (data.hourly.weather_code[i] <= 49 && data.hourly.is_day[i] == 0) {
                wData.wCond = `<i class="wi wi-night-clear"></i>`;
            }
            if (data.hourly.weather_code[i] > 49 && data.hourly.weather_code[i] <= 99 && data.hourly.is_day[i] == 1) {
                wData.wCond = `<i class="wi wi-day-rain"></i>`
            }
            if (data.hourly.weather_code[i] > 49 && data.hourly.weather_code[i] <= 99 && data.hourly.is_day[i] == 0) {
                wData.wCond = `<i class="wi wi-night-rain"></i>`
            }
            DataArr.push(wData);
        }
        for (let i = 0; i < DataArr.length; i++) {
            $("#weatherTable tbody").append("<tr><td>" + DataArr[i].temp + " </td><td>" + DataArr[i].time + " </td><td>" + DataArr[i].pProb + "%</td><td>" + DataArr[i].wCond + "</td></tr>");
        }
    }
    catch (e) {
        console.log(e);
    }
}



async function processGetPastData(latitude, longitude) {
    let deg = prompt("F or C?")
    let DataArr = []
    try {
        let data = await GetPastData(latitude, longitude);
        for (let i = 0; i < data.hourly.time.length; i++) {
            let wData = Object.create(pData);
            wData.lat = data.latitude.toString();
            wData.long = data.longitude.toString();
            wData.timezone = data.timezone;
            if (deg == 'C') {
                wData.temp = data.hourly.temperature_2m[i].toString();
            }
            else if (deg == 'F') {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
                wData.temp = Math.trunc((data.hourly.temperature_2m[i] * 9 / 5) + 32).toString();
            }
            else {
                console.log("Misinput detected, using Celsius by default");
                wData.temp = data.hourly.temperature_2m[i].toString();
            }
            wData.time = data.hourly.time[i];
            wData.pProb = data.hourly.precipitation[i];
            wData.is_Day = data.hourly.is_day[i];
            if (data.hourly.weather_code[i] <= 49 && data.hourly.is_day[i] == 1) {
                wData.wCond = `<i class="wi wi-day-sunny"></i>`;
            }
            if (data.hourly.weather_code[i] <= 49 && data.hourly.is_day[i] == 0) {
                wData.wCond = `<i class="wi wi-night-clear"></i>`;
            }
            if (data.hourly.weather_code[i] > 49 && data.hourly.weather_code[i] <= 99 && data.hourly.is_day[i] == 1) {
                wData.wCond = `<i class="wi wi-day-rain"></i>`
            }
            if (data.hourly.weather_code[i] > 49 && data.hourly.weather_code[i] <= 99 && data.hourly.is_day[i] == 0) {
                wData.wCond = `<i class="wi wi-night-rain"></i>`
            }
            DataArr.push(wData);
        }
        for (let i = 0; i < DataArr.length; i++) {
            $("#weatherTable tbody").append("<tr><td>" + DataArr[i].temp + " </td><td>" + DataArr[i].time + " </td><td>" + DataArr[i].pProb + "mm</td><td>" + DataArr[i].wCond + "</td></tr>");
        }
    }
    catch (e) {
        console.log(e);
    }
}

function main() {
    let latitude = parseFloat(prompt("enter latitude"));
    let longitude = parseFloat(prompt("enter longitude"));
    let choice = prompt("1 for forecast, 2 for past data");
    if (choice == '1') {

        processGetForecastData(latitude, longitude);
    }
    else if (choice == '2') {

        processGetPastData(latitude, longitude);
    }

}
main();
