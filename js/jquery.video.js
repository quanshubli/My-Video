(function ($) {
    $.extend({

        initVideo: function (e, p) {

            var option = {

                load: function () {
                    var h = '<div class="video">';
                    h += '<video width="580" height="362">';
                    h += '<source src="' + p.url + '" type="video/mp4" />';
                    h += '</video>';
                    h += '<div class="play"></div>';
                    h += '</div>';
                    h += '<div class="controls">';
                    h += '<div class="pause">';
                    h += '<img src="../images/play_s.png" alt="" width="28">';
                    h += '</div>';
                    h += '<div class="progress-wrap">';
                    h += '<div id="progressBar" class="progress-bar">';
                    h += '<div class="buffered"></div>';
                    h += '<div class="progress"></div>';
                    h += '<div class="progress-dot"></div>';
                    h += '</div>';
                    h += '</div>';
                    h += '<div class="time">00:00/00:00</div>';
                    h += '<div class="sound-wrap">';
                    h += '<div class="sound-btn">';
                    h += '<img src="../images/sound_l.png" alt="" width="16">';
                    h += '</div>';
                    h += '<div class="volume-wrap">';
                    h += '<div class="volume-val">100</div>';
                    h += '<div class="volume-bar">';
                    h += '<div class="volume"></div>';
                    h += '<div class="volume-dot"></div>';
                    h += '</div>';
                    h += '</div>';
                    h += '</div>';
                    h += '</div>';

                    $(e).html(h);
                    var video = e.getElementsByTagName('video')[0];
                    window.onload = function () {
                        $(e).find('.time').text(option.timeTransform(video.currentTime) + '/' + option.timeTransform(video.duration));
                        $(e).hover(function () {
                            $(this).children('.controls').css('bottom', '0px');
                        }, function () {
                            $(this).children('.controls').css('bottom', '-28px');
                        });
                        $('.sound-wrap').hover(function () {
                            $('.volume-wrap').fadeIn();
                        }, function () {
                            $('.volume-wrap').fadeOut();
                        });
                        $('.sound-btn').bind('click', function () {
                            option.muteHandle();
                        });
                    }
                },

                pauseHandle: function () {
                    var video = e.getElementsByTagName('video')[0];
                    if (video.paused) {
                        $(e).find('.play').hide();
                        $(e).find('.pause').children('img').prop('src', '../images/pause_s.png');
                        video.play();
                        option.whenPlay();
                    } else {
                        $(e).find('.play').show();
                        $(e).find('.pause').children('img').prop('src', '../images/play_s.png');
                        video.pause();
                    }
                },

                muteHandle: function () {
                    var video = e.getElementsByTagName('video')[0];
                    var totalHeight = $(e).find('.volume-bar').height();
                    if (video.muted) {
                        video.muted = false;
                        $(e).find('.volume-val').text(parseInt(video.volume * 100));
                        $(e).find('.sound-btn').children('img').prop('src', '../images/sound_l.png');
                        $(e).find('.volume').height(video.volume * totalHeight);
                        $(e).find('.volume-dot').css('top', (1 - video.volume) * totalHeight - 8 + 'px');
                    } else {
                        video.muted = true;
                        $(e).find('.volume-val').text(parseInt(0));
                        $(e).find('.sound-btn').children('img').prop('src', '../images/sound_off.png');
                        $(e).find('.volume').height(0);
                        $(e).find('.volume-dot').css('top', totalHeight - 8 + 'px');
                    }
                },

                whenPlay: function () {
                    var video = e.getElementsByTagName('video')[0];
                    var totalWidth = $(e).find('.progress-bar').width();
                    var totalHeight = $(e).find('.volume-bar').height();
                    var timer = setInterval(function () {
                        var buffered = video.buffered;
                        var bufferedTime = 0;
                        for (var i = 0; i < buffered.length; i++) {
                            bufferedTime = buffered.end(i) - buffered.start(0);
                        }
                        var currentTime = video.currentTime;
                        var currentVolume = video.volume;
                        var bufferedPercent = bufferedTime / video.duration * 100;
                        var playPercent = currentTime / video.duration * 100;
                        $(e).find('.buffered').width(bufferedPercent + '%');
                        $(e).find('.progress').width(playPercent + '%');
                        $(e).find('.progress-dot').css('left', currentTime / video.duration * totalWidth - 8 + 'px');
                        $(e).find('.time').text(option.timeTransform(video.currentTime) + '/' + option.timeTransform(video.duration));
                    }, 30);
                },

                dragProgressDot: function (event) {
                    var dot = event.target;
                    var downX = (event || window.event).clientX;
                    var dotL = event.target.offsetLeft;
                    var max = $('.progress-bar').width();
                    $(document).bind('mousemove', function (event) {
                        var video = e.getElementsByTagName('video')[0];
                        var moveX = (event || window.event).clientX;
                        var to = Math.min(max, Math.max(-8 + 8, dotL + (moveX - downX) + 8));
                        video.currentTime = (to / max) * video.duration;
                        $(e).find('.progress').width(video.currentTime / video.duration * 100 + '%');
                        console.log();
                        $(e).find('.progress-dot').css('left', video.currentTime / video.duration * max - 8 + 'px');
                    });
                    $(document).bind('mouseup', function () {
                        $(document).unbind();
                    });
                },

                dragVolumeDot: function (event) {
                    var dot = event.target;
                    var downY = (event || window.event).clientY;
                    var max = $('.volume-bar').height();
                    var dotT = event.target.offsetTop;
                    $(document).bind('mousemove', function (event) {
                        var video = e.getElementsByTagName('video')[0];
                        var moveY = (event || window.event).clientY;
                        var to = Math.min(max, Math.max(-8 + 8, dotT + (moveY - downY) + 8));
                        video.volume = 1 - to / max;
                        $(e).find('.volume-val').text(parseInt(video.volume * 100));
                        $(e).find('.volume').height(video.volume * max);
                        $(e).find('.volume-dot').css('top', (1 - video.volume) * max - 8 + 'px');
                    });
                    $(document).bind('mouseup', function () {
                        $(document).unbind();
                    });
                },

                timeTransform: function (time) {
                    let newTime = '';
                    if (time > 60) {
                        const minutes = parseInt(time / 60);
                        const seconds = parseInt(time % 60);
                        newTime = (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
                    } else {
                        const seconds = parseInt(time);
                        newTime = '00:' + (seconds < 10 ? ('0' + seconds) : seconds);
                    }
                    return newTime;
                }
            }

            // 加载播放器
            option.load();

            // 点击播放
            $(e).children('.video').bind('click', function () {
                option.pauseHandle();
            });
            $(e).find('.pause').children('img').bind('click', function () {
                option.pauseHandle();
            });

            // 拖拽
            $(e).find('.progress-dot').bind('mousedown', function (event) {
                option.dragProgressDot(event);
            });
            $(e).find('.volume-dot').bind('mousedown', function (event) {
                option.dragVolumeDot(event);
            });
        }
    });

    $.fn.extend({
        createVideo: function (p) {
            return this.each(function () {
                $.initVideo(this, p);
            });
        }
    });
})(jQuery)