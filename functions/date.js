

exports.currentDay = function () {
    const options = { 
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };

    let today  = new Date();

    return today.toLocaleDateString("en-US", options); // Saturday, September 17
}

