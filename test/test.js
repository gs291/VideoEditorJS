test('compressName()', function () {
    equal(compressName("123"), "123");
    equal(compressName("123456789012"), "123456789012");
    equal(compressName("1234567890123"), "1234...90123")
    equal(compressName("1234567890123456789"), "1234...56789");
})

test('uId()', function () {
    ok(uId(), 'All good');
})

test('rowById()', function () {
    var temp = [
        {id: 1},
        {id: 2},
        {id: 3}];

    var temp2 = [{}];    
    equal(rowById(7, temp), -1);
    equal(rowById(1, temp), 0);
    equal(rowById('A', temp), -1);
    equal(rowById(5, temp2), -1);
})

test('timeToSeconds()', function () {
    equal(timeToSeconds('0:0:0.00'),    0);
    equal(timeToSeconds('0:0:0.30'),    0); 
    equal(timeToSeconds('0:0:30.00'),   30); 
    equal(timeToSeconds('0:0:30.30'),   30); 
    equal(timeToSeconds('0:30:0.00'),   1800); 
    equal(timeToSeconds('0:30:30.00'),  1830); 
    equal(timeToSeconds('0:30:30.30'),  1830);
    equal(timeToSeconds('30:0:0.00'),   108000);
    equal(timeToSeconds('30:30:0.00'),  109800);
    equal(timeToSeconds('30:30:30.00'), 109830);
    equal(timeToSeconds('30:30:30.30'), 109830);
})

test('pixelToTime()', function() {
    oneSecond = 1; 
    equal(pixelToTime(1), "00:00:01");
    equal(pixelToTime(100), "00:01:40");
    equal(pixelToTime(1000), "00:16:40");

    oneSecond = .1;
    equal(pixelToTime(1), "00:00:10");
    equal(pixelToTime(100), "00:16:40");
    equal(pixelToTime(1000), "02:44:40");
    
    oneSecond = .01;
    equal(pixelToTime(.01), "00:00:01");
    equal(pixelToTime(.1), "00:00:10");
    equal(pixelToTime(1), "00:01:40");
    
    oneSecond = .36;
    equal(pixelToTime(1), "00:00:02");
    equal(pixelToTime(100), "00:04:37");
    equal(pixelToTime(256), "00:11:51");
    
    oneSecond = 1000000000;
    equal(pixelToTime(1), "00:00:00");
    equal(pixelToTime(100), "00:00:00");
    equal(pixelToTime(1000), "00:00:00");

    oneSecond = 1;
    equal(pixelToTime("Hot Dogs"), "00:00:00");
    equal(pixelToTime(-23), "00:00:00");
    equal(pixelToTime("1"), "00:00:01");
    equal(pixelToTime(1234567891), "337313:38:31");

    oneSecond = "Hot Dogs";
    equal(pixelToTime(1), "00:00:00");
    equal(pixelToTime(100), "00:00:00");
    equal(pixelToTime(1000), "00:00:00");
})

test('addZero()', function () {
    equal(addZero(1), "01");
    equal(addZero(2), "02");
    equal(addZero(10), "10");
    equal(addZero(-23), "0-23");
    equal(addZero("1"), "01");
    equal(addZero("SLDJFL"), "error");
    equal(addZero(.2322), "00.2322");
})

test('rgbToHex()', function () {
    equal(rgbToHex(10, 10, 10), "#0a0a0a");
    equal(rgbToHex(211, 8, 32), "#d30820")
    equal(rgbToHex(255, 255, 255), "#ffffff");
    equal(rgbToHex(-10, 10, 10), "error");
    equal(rgbToHex(101882, 101212, 10), "error");
    equal(rgbToHex("dogs", "cats", 10), "error");
})

//this does not work?????????
test('findFirstDescendant()', function () {
    var markup = '<h1 id="qunit-header"></h1>';
    var parser = new DOMParser();
    var temp = parser.parseFromString(markup, "text/xml");
    equal(findFirstDescendant('qunit', 'h1'), temp.firstChild);

    
    var markup = '<h1 id="qunit-header "></h1>';
    var parser = new DOMParser();
    var temp = parser.parseFromString(markup, "text/xml");
    equal(findFirstDescendant('qunit', 'h1'), temp.firstChild);     

})

test('secondToTime()', function () {
    equal(secondToTime(0), '00h00m00s');
    equal(secondToTime(0), '00h00m00s');
    equal(secondToTime(30), '00h00m30s');
    equal(secondToTime(30), '00h00m30s');
    equal(secondToTime(1800), '00h30m00s');
    equal(secondToTime(1830), '00h30m30s');
    equal(secondToTime(1830), '00h30m30s');
    equal(secondToTime(108000), '06h00m00s');
    equal(secondToTime(109800), '06h30m00s');
    equal(secondToTime(109830), '06h30m30s');
    equal(secondToTime(109830), '06h30m30s');
})