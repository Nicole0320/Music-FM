var channelsList = [];
var currentChannels = [];
var currentChannelsId = 2;
var currentSong = {};
var playing = true;
var clock = 1;
var time = 0;
var duration = 0;
var lyric = [];
var lyricClock = -2;
var likePlaylist = {
    playing: -1,
    playlist: []
}
var isRequesting = false; //获取歌曲装状态锁

$(window).ready(function(){
    $('audio').attr('autoplay', 'true');
    var lyricBoxHeight = $('.fm-container').innerHeight()-$('#main').outerHeight()-$('.topbar').outerHeight()-60;
    $('.lyric').css('height',lyricBoxHeight+'px');

    // 获取播放频道
    // $.get('http://api.jirengu.com/fm/getChannels.php')
    // .done(function(channelInfo){
    //     channelsList = JSON.parse(channelInfo).channels;
    //     channelsList.unshift({"channel_id":"favorite","name":"我喜欢的"})
    //     var obj = {channel_id: '', name: ''};
    //     channelsList.push(obj);
    //     channelsList.unshift(obj);
    //     currentChannels = channelsList.slice(1, 4);
    //     updateChannels();
    //     loadSong();
    // });

    //为解决github page的https协议，把频道列表写死
    channelsList = [{"channel_id":"","name":""},{"channel_id":"favorite","name":"我喜欢的"},{"name":"漫步春天","channel_id":"public_tuijian_spring"},{"name":"秋日私语","channel_id":"public_tuijian_autumn"},{"name":"温暖冬日","channel_id":"public_tuijian_winter"},{"name":"热歌","channel_id":"public_tuijian_rege"},{"name":"KTV金曲","channel_id":"public_tuijian_ktv"},{"name":"Billboard","channel_id":"public_tuijian_billboard"},{"name":"成名曲","channel_id":"public_tuijian_chengmingqu"},{"name":"网络歌曲","channel_id":"public_tuijian_wangluo"},{"name":"开车","channel_id":"public_tuijian_kaiche"},{"name":"影视","channel_id":"public_tuijian_yingshi"},{"name":"随便听听","channel_id":"public_tuijian_suibiantingting"},{"name":"经典老歌","channel_id":"public_shiguang_jingdianlaoge"},{"name":"70后","channel_id":"public_shiguang_70hou"},{"name":"80后","channel_id":"public_shiguang_80hou"},{"name":"90后","channel_id":"public_shiguang_90hou"},{"name":"火爆新歌","channel_id":"public_shiguang_xinge"},{"name":"儿歌","channel_id":"public_shiguang_erge"},{"name":"旅行","channel_id":"public_shiguang_lvxing"},{"name":"夜店","channel_id":"public_shiguang_yedian"},{"name":"流行","channel_id":"public_fengge_liuxing"},{"name":"摇滚","channel_id":"public_fengge_yaogun"},{"name":"民谣","channel_id":"public_fengge_minyao"},{"name":"轻音乐","channel_id":"public_fengge_qingyinyue"},{"name":"小清新","channel_id":"public_fengge_xiaoqingxin"},{"name":"中国风","channel_id":"public_fengge_zhongguofeng"},{"name":"DJ舞曲","channel_id":"public_fengge_dj"},{"name":"电影","channel_id":"public_fengge_dianyingyuansheng"},{"name":"轻松假日","channel_id":"public_xinqing_qingsongjiari"},{"name":"欢快旋律","channel_id":"public_xinqing_huankuai"},{"name":"甜蜜感受","channel_id":"public_xinqing_tianmi"},{"name":"寂寞","channel_id":"public_xinqing_jimo"},{"name":"单身情歌","channel_id":"public_xinqing_qingge"},{"name":"舒缓节奏","channel_id":"public_xinqing_shuhuan"},{"name":"慵懒午后","channel_id":"public_xinqing_yonglanwuhou"},{"name":"伤感","channel_id":"public_xinqing_shanggan"},{"name":"华语","channel_id":"public_yuzhong_huayu"},{"name":"欧美","channel_id":"public_yuzhong_oumei"},{"name":"日语","channel_id":"public_yuzhong_riyu"},{"name":"韩语","channel_id":"public_yuzhong_hanyu"},{"name":"粤语","channel_id":"public_yuzhong_yueyu"},{"channel_id":"","name":""}]
    var obj = {channel_id: '', name: ''};
    currentChannels = channelsList.slice(1, 4);
    updateChannels();
    loadSong();
    loadPlaylist();
});

//下一曲
$('.icon-next').on('click', function(){
    if(isRequesting){
        return;
    }
    loadSong();
})

//频道右转
$('.next').on('click', function(){
    if(currentChannelsId >= channelsList.length-2){
        return;
    }
    
    currentChannelsId++;

    currentChannels = channelsList.slice(currentChannelsId-1, currentChannelsId+2);
    updateChannels();
    loadSong();
})

//频道左转
$('.prev').on('click', function(){
    if(currentChannelsId <= 1){
        return;
    }

    currentChannelsId--;

    currentChannels = channelsList.slice(currentChannelsId-1, currentChannelsId+2);
    if(currentChannels[1].channel_id === 'favorite'){
        if(likePlaylist.playlist.length === 0){
            alert('“我喜欢的”音乐播放列表还是空的哦，先从别的频道收藏几首喜欢的音乐吧~');
            currentChannelsId++;
            currentChannels = channelsList.slice(currentChannelsId-1, currentChannelsId+2);
            return;
        }
    }
    updateChannels();
    loadSong();
})

//播放和暂停
$('.play-or-pause').on('click', function(){
    if(isRequesting){
        return;
    }
    if(playing === true){
        $(this).removeClass('icon-pause').addClass('icon-play');
        $('audio')[0].pause();
        playing = false;
    }
    else{
        $(this).removeClass('icon-play').addClass('icon-pause');
        $('audio')[0].play();
        playing = true;
    }
})

$('.open-channels').on('click', function(){
    $channels = $('#channels');
    $.each(channelsList, function(key, value){
        var tempHTML = '<li data="'+ value.channel_id +'>'+value.name+'</li>';
        $channels.append(tempHTML);
    })
})

//加载播放信息
$('audio').on('canplay', function(){
    var $audio = $('audio')[0];
    duration = $audio.duration;
    time = 0;
    clock = setInterval(function(){
        if(time >= Math.floor(duration)){
            clearInterval(clock);
            return;
        }
        time = $audio.currentTime;
        var timeRate = Math.floor(time/duration*1000)/10 + '%';
        $('.played').css('width', timeRate);
        leftTime(duration - time);
    }, 1000);
})

$('audio').on('ended', function(){
    loadSong();
})

//调节播放进度
$('.time-line>.line').on('click', function(e){
    if(isRequesting){
        return;
    }
    var position = e.pageX - $(this).offset().left;
    time = position/$(this).innerWidth()*duration;
    $('audio')[0].currentTime = time;
})

//调节音量
$('.volume-controler').on('click', function(e){
    $this = $(this);
    var position = e.pageY - $this.offset().top;
    var volume = (position-5)/50;
    if(volume>=1){
        $('audio')[0].volume = 0;
        $this.children('.volume-height').css('height', '100%');
        $('.volume').addClass('silence');
    }
    else if(volume<=0){
        $('audio')[0].volume = 1;
        $this.children('.volume-height').css('height', '0%');
        $('.volume').removeClass('silence');
    }
    else{
        $('audio')[0].volume = 1-volume;
        $this.children('.volume-height').css('height', volume*100 + '%');
        $('.volume').removeClass('silence');
    }
})

//“喜欢”按钮点击效果
$('.like').on('click', function(e){
    if(isRequesting){
        return;
    }
    $this = $(this);
    if($this.hasClass('chosen')){
        $this.removeClass('chosen');
        var deletedSong  = likePlaylist.playlist.splice(likePlaylist.playing, 1);
        if(currentChannels[1].channel_id === 'favorite' && deletedSong[0].sid === currentSong.sid){
            likePlaylist.playing = (likePlaylist.playing + likePlaylist.playlist.length - 1) % likePlaylist.playlist.length;
        }
        else{
            likePlaylist.playing = -1;
        }
    }
    else{
        $this.addClass('chosen')
        likePlaylist.playlist.push(currentSong);
        likePlaylist.playing = likePlaylist.playlist.length-1;
    }
    localStorage.setItem('playlist', JSON.stringify(likePlaylist.playlist))
    loadPlaylist();
})

//点击喜欢列表中的歌曲，即播放该歌曲
$('.playlist').on('click','li',function(){
    var index = $('.playlist>li').index($(this));
    likePlaylist.playing = index;
    currentSong = likePlaylist.playlist[index];
    loadDetailsOfSong();
})

//从收藏列表中删除歌曲
$('ul').on('click', 'li>.delete-song', function(e){
    e.stopPropagation();
    var index = $('.playlist>li>.delete-song').index($(this));
    var deletedSong = likePlaylist.playlist.splice(index, 1);
    localStorage.setItem('playlist', JSON.stringify(likePlaylist.playlist))
    loadPlaylist();
    if(deletedSong[0].sid === currentSong.sid){
        $('.like').removeClass('chosen');
        if(currentChannels[1].channel_id === 'favorite'){
            likePlaylist.playing = (index + likePlaylist.playlist.length - 1) % likePlaylist.playlist.length;
        }
    }
})

//清空收藏的音乐列表
$('.clear-playlist').on('click', function(e){
    var confirmed = confirm('您将删除收藏列表中的所有歌曲，仍要继续操作请点击确认');
    if(confirmed){
        localStorage.clear();
        loadPlaylist();
        if(currentChannels[1].channel_id === "favorite"){
            alert('“我喜欢的”音乐播放列表还是空的哦，先去其他频道收藏几首喜欢的音乐吧~');
            currentChannelsId++;
            currentChannels = channelsList.slice(currentChannelsId-1, currentChannelsId+2);
            updateChannels();
            loadSong();
        }
        if($('.like').hasClass('chosen')){
            $('.like').removeClass('chosen');
        }
    }
})

function updateChannels(){
    for(var i=0; i<3; i++){
        $('.channels').children().eq(i).html(currentChannels[i].name);
    }
}

function loadSong(){
    isRequesting = true;
    clearInterval(clock);
    //当前列表不是“我喜欢的音乐”则从API获取当前频道的随机歌曲，否则从“喜欢”列表加载
    if(currentChannels[1].channel_id === 'favorite'){
        if(likePlaylist.playing === -1){
            currentSong = likePlaylist.playlist[0];
            likePlaylist.playing = 0;
        }
        else{
            likePlaylist.playing = (likePlaylist.playing + 1 ) % likePlaylist.playlist.length;
            currentSong = likePlaylist.playlist[likePlaylist.playing];
        }
        isRequesting = false;
        loadDetailsOfSong();
    }
    else{
        $.get('https://jirenguapi.applinzi.com/fm/getSong.php',{channel: currentChannels[1].channel_id})
            .done(function(song){
                isRequesting = false;
                currentSong = JSON.parse(song).song[0];
                if(currentSong.url === null){
                    console.log('这首歌是空的，再来一首')
                    loadSong();
                }
                else{
                    loadDetailsOfSong();
                }
            });
    }
}

function loadDetailsOfSong(){
    $('.played').css('width', '0%');
    $('.second').html('00');
    $('.minute').html('00');
    $('.like').removeClass('chosen');
    var indexOfAt = currentSong.picture.indexOf('@');
    var pictureURL = currentSong.picture.substring(0,indexOfAt);
    lyric = [];
    $('img').attr('src', pictureURL);
    $('.artist').html(currentSong.artist);
    $('.title').html(currentSong.title);
    $('audio').attr('src', currentSong.url);
    loadLrc(currentSong.sid);
    isLiked(currentSong);
}

function loadLrc(songID){
    $.post('https://jirenguapi.applinzi.com/fm/getLyric.php',{sid: songID})
    .done(function(res){
        clearInterval(lyricClock);
        var curLrcNum = 0;
        decodeLyric(JSON.parse(res).lyric);
        $('.lyric').html(lyric);
        renderLyric();
        lyricClock = setInterval(function(){
            curLrcNum = scrollLyric(curLrcNum);
            if(curLrcNum > lyric.length-1){
                clearInterval(lyricClock);
            }
        }, 20);
    });
}

function decodeLyric(lrcString){
    var lrcArr = lrcString.split('\n');
    lrcArr.forEach(function(element) {
        var lrcObj = {};
        var lrcTime = element.match(/\[(?:\d+:)\d+.\d+]/g);
        var lrcContent = element.match(/\][^\[].*/g)
        if(lrcTime !== null){
            lrcTime.forEach(function(ele){
                var min = 0, sec = 0, secTime = 0;
                min = ele.match(/\[\d+:/)[0].slice(1,3);
                sec = ele.match(/\:\d+.\d+/)[0].slice(1,6);
                secTime = parseInt(min)*60 + parseFloat(sec);
                if(lrcContent !== null){
                    lrcObj.time = secTime;
                    lrcObj.content = lrcContent[0].slice(1,lrcContent[0].length);
                }
            })
        }
        if(lrcObj.hasOwnProperty('time') && lrcObj.time !== 0.01){
            lyric.push(lrcObj);
        }
    }, lrcArr);
    lyric.sort(function(a,b){
        return a.time-b.time;
    })
}

function renderLyric(){
    $('.lyric').empty();
    var end = {
        content: "~ end ~",
        time: duration-0.1
    }
    lyric.push(end);
    $.each(lyric, function(key,value){
        var html = '<li>'+ value.content +'</li>';
        $('.lyric').append(html)
    });
}

function leftTime(num){
    num = Math.floor(num);
    var sec = num%60;
    var min = Math.floor(num/60);
    if(min<10){
        $('.minute').html('0'+min);
    }
    else{
        $('.minute').html(min);
    }
    if(sec<10){
        $('.second').html('0'+sec);
    }
    else{
        $('.second').html(sec);
    }
}

function scrollLyric(curLrcNum){
    if(lyric[curLrcNum+1]){
        if(time < lyric[curLrcNum+1].time && time >= lyric[curLrcNum].time){
            return curLrcNum;
        }
        else if(time >= lyric[curLrcNum+1].time){
            curLrcNum++;
            renderScrollLyric(curLrcNum);
        }
        else{
            if(curLrcNum < 1){
                return curLrcNum;
            }
            curLrcNum--;
            renderScrollLyric(curLrcNum);
        }
    }
    return curLrcNum;
}

function renderScrollLyric(curLrcNum){
    $lyric = $('.lyric');
    $lyric.children('li').removeClass('current-line');
    $lyric.children('li').eq(curLrcNum).addClass('current-line');
    //单行歌词的高度
    var lineHeight = $lyric.children('li').eq(0).outerHeight()+5;
    //第一行歌词顶端到当前歌词的距离
    var curOffenset = lineHeight*(curLrcNum+1) + $('.current-line').outerHeight(true)/2;
    //整篇歌词的实际高度
    var lrcLength = $('.current-line').outerHeight(true)*lyric.length;
    //显示歌词的可见窗口的高度
    var height = $lyric.height();

    if(curOffenset>(height/2) && lrcLength-curOffenset > height/2){
        $lyric.scrollTop(curOffenset - height/2);
    }
    else if(curOffenset<=(height/2)){
        $lyric.scrollTop(0);
    }
    else{
        $lyric.scrollTop(lrcLength - height);
    }
}

function loadPlaylist(){
    likePlaylist.playlist =  JSON.parse(localStorage.getItem('playlist'))||[]
    var html = '';
    $.each(likePlaylist.playlist, function(key, value){
        html += `<li>
            <div class="list-item-title">${value.title}</div>
            <div class="list-item-artist">${value.artist}</div>
            <div class="iconfont icon-trash delete-song"></div>
            </li>`;
     })
    $('.playlist').empty().append(html);
}

//检查当前歌曲是否已经在播放列表，是则返回在列表中的位置，否则返回-1
function isLiked(song){
    var num = -1
    $.each(likePlaylist.playlist, function(key, value){
        if(value.sid === song.sid){
            $('.like').addClass('chosen');
            num = key;
        }
    })
    likePlaylist.playing = num;
}