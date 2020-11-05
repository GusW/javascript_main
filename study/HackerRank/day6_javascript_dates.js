function getDayName(dateString) {
    let dayName;
    const dateObj = new Date(dateString);
    switch(true){
        case(dateObj.getDay()=='0'):
            dayName = "Sunday";
            break;
        case(dateObj.getDay()=='1'):
            dayName = "Monday";
            break;
        case(dateObj.getDay()=='2'):
            dayName = "Tuesday";
            break;
        case(dateObj.getDay()=='3'):
            dayName = "Wednesday";
            break;
        case(dateObj.getDay()=='4'):
            dayName = "Thursday";
            break;
        case(dateObj.getDay()=='5'):
            dayName = "Friday";
            break;
        case(dateObj.getDay()=='6'):
            dayName = "Saturday";
            break;
    }
    return dayName;
}
