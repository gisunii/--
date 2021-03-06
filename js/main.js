$(function () {
    var isMapAdded = false;
    // 导航按钮
    $('.btn-triger').click(function () {
	    $(this).closest('.btn-group').toggleClass('open');
    });
    // 页面切换
    var $navList = $('.btn-list > .nav-tabs-btn');
    $navList.click(function () {
        var pageList = $('.page-list .page-item');
        pageList.each(function(){
            var isActive = $(this).hasClass('active');
            if(isActive) {
                $(this).animate({left:'-760px'});
                $(this).removeClass('active');
            } else {
                $(this).css('left','760px');
            }
        });
        var dataNav = $(this).attr('data-nav');
        var pageItem = $('.data-nav-' + dataNav);
        if(dataNav == 4 && !isMapAdded) {
            addMap();
            isMapAdded = true;
        }
        pageItem.animate({left:'0'});
        pageItem.addClass('active');
    });

    // 时间轴页面
    $('.main-timeline').mousewheel(function(event, delta) {
        // console.log(event, delta);
        var topOld = parseInt($('.main-timeline').css('top'));
        var topNew = topOld + delta * 30;
        topNew = topNew>0?0:topNew;
        topNew = topNew<-367?-367:topNew;
        $('.main-timeline').css('top', topNew);
        return false;
    });

    // 地图页面
    function addMap() {
        var positionArr = [[108.393135, 31.160711], [116.286407, 39.748232], [114.035504, 22.524612]]; // 开州,北京建筑大学,福田
        var titileArr = ['重庆市开州区', '北京建筑大学', '深圳市福田区'];
        var iconArr = ['pos-home.png', 'pos-school.png', 'pos-me.png'];
        var map = new AMap.Map('map',{
            zoom: 3,
            center: positionArr[0],
            doubleClickZoom: false,
            mapStyle: 'amap://styles/graffiti'
        });
        // 双击返回主视图
        map.on('dblclick', function(e) {
            map.setZoomAndCenter(3, positionArr[0]);
        });
        // 地图加载完毕后
        map.on('complete', function() {
            showPositionPoints();
            loadLocalWeather();
            drivingSearch();
        });

        function showPositionPoints() {
            for (var i = 0; i < 3; i++) {
                var icon = new AMap.Icon({
                    image: './images/' + iconArr[i],
                    size: new AMap.Size(24, 24)
                });
                marker = new AMap.Marker({
                    icon: icon,
                    position: positionArr[i],
                    zIndex: 101,
                    offset : new AMap.Pixel(-12,-12),
                    title: titileArr[i],
                    map: map
                });
                marker.on('click', function(e) {
                    map.setZoomAndCenter(14, [e.target.getPosition().lng, e.target.getPosition().lat]);
                });
            }
        };

        function loadLocalWeather() {
            // 定位城市并获取天气信息
            map.plugin('AMap.CitySearch', function() {
                var citysearch = new AMap.CitySearch();
                citysearch.getLocalCity(function(status, result) {
                    var weather = '';
                    if (status === 'complete' && result.info === 'OK') {
                        if (result && result.city) {
                            var cityInfo = result.city;
                            AMap.service('AMap.Weather', function() {
                                var weather = new AMap.Weather();
                                weather.getLive(cityInfo, function(err, data) {
                                    if (!err) {
                                        var weather = '<p class="temperature">'+data.temperature+'℃</p>' +
                                                      '<p><i class="fa fa-map-marker"></i>'+data.city+'</p>';
                                        $('.weather').html(weather);
                                    } else {
                                        $('.weather').html('<p class="error">获取天气信息失败!</p>');
                                    }
                                });
                            });
                        } else {
                            $('.weather').html('<p class="error">获取城市信息失败!</p>');
                        }
                    } else {
                        $('.weather').html('<p class="error">定位失败!</p>');
                    }
                    
                });
            });
        };

        function drivingSearch() {
            AMap.service('AMap.Driving',function() {
                var drivingOption = {
                    map: map,
                    policy: AMap.DrivingPolicy.LEAST_DISTANCE,
                    hideMarkers: true,
                    autoFitView: false
                };
                var driving1 = new AMap.Driving(drivingOption);
                var driving2 = new AMap.Driving(drivingOption);
                var driving3 = new AMap.Driving(drivingOption);
        
                driving1.search(positionArr[0], positionArr[1], function(status, result) { });
                driving2.search(positionArr[0], positionArr[2], function(status, result) { });
                driving3.search(positionArr[1], positionArr[2], function(status, result) { });
            });
        };
        
    };
})