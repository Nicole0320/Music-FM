let channelsList = [];
            let currentChannels = [];
            let currentChannelsId = 1;
            let currentSong = {};
            let playing = true;
            let clock = 0;
            let time = 0;
            let duration = 0;

            $(window).ready(function(){
                $('audio').attr('autoplay', 'true');
                // $.get('http://api.jirengu.com/fm/getChannels.php')
                // .done(function(channelInfo){
                //     channelsList = JSON.parse(channelInfo).channels;
                //     let obj = {channel_id: '', name: ''};
                //     channelsList.push(obj);
                //     channelsList.unshift(obj);
                //     currentChannels = channelsList.slice(0, 3);
                //     updateChannels();
                //     loadSong();
                // });

                //为解决github page的https协议，把频道列表写死
                channelsList = [{"channel_id":"","name":""},{"name":"漫步春天","channel_id":"public_tuijian_spring"},{"name":"秋日私语","channel_id":"public_tuijian_autumn"},{"name":"温暖冬日","channel_id":"public_tuijian_winter"},{"name":"热歌","channel_id":"public_tuijian_rege"},{"name":"KTV金曲","channel_id":"public_tuijian_ktv"},{"name":"Billboard","channel_id":"public_tuijian_billboard"},{"name":"成名曲","channel_id":"public_tuijian_chengmingqu"},{"name":"网络歌曲","channel_id":"public_tuijian_wangluo"},{"name":"开车","channel_id":"public_tuijian_kaiche"},{"name":"影视","channel_id":"public_tuijian_yingshi"},{"name":"随便听听","channel_id":"public_tuijian_suibiantingting"},{"name":"经典老歌","channel_id":"public_shiguang_jingdianlaoge"},{"name":"70后","channel_id":"public_shiguang_70hou"},{"name":"80后","channel_id":"public_shiguang_80hou"},{"name":"90后","channel_id":"public_shiguang_90hou"},{"name":"火爆新歌","channel_id":"public_shiguang_xinge"},{"name":"儿歌","channel_id":"public_shiguang_erge"},{"name":"旅行","channel_id":"public_shiguang_lvxing"},{"name":"夜店","channel_id":"public_shiguang_yedian"},{"name":"流行","channel_id":"public_fengge_liuxing"},{"name":"摇滚","channel_id":"public_fengge_yaogun"},{"name":"民谣","channel_id":"public_fengge_minyao"},{"name":"轻音乐","channel_id":"public_fengge_qingyinyue"},{"name":"小清新","channel_id":"public_fengge_xiaoqingxin"},{"name":"中国风","channel_id":"public_fengge_zhongguofeng"},{"name":"DJ舞曲","channel_id":"public_fengge_dj"},{"name":"电影","channel_id":"public_fengge_dianyingyuansheng"},{"name":"轻松假日","channel_id":"public_xinqing_qingsongjiari"},{"name":"欢快旋律","channel_id":"public_xinqing_huankuai"},{"name":"甜蜜感受","channel_id":"public_xinqing_tianmi"},{"name":"寂寞","channel_id":"public_xinqing_jimo"},{"name":"单身情歌","channel_id":"public_xinqing_qingge"},{"name":"舒缓节奏","channel_id":"public_xinqing_shuhuan"},{"name":"慵懒午后","channel_id":"public_xinqing_yonglanwuhou"},{"name":"伤感","channel_id":"public_xinqing_shanggan"},{"name":"华语","channel_id":"public_yuzhong_huayu"},{"name":"欧美","channel_id":"public_yuzhong_oumei"},{"name":"日语","channel_id":"public_yuzhong_riyu"},{"name":"韩语","channel_id":"public_yuzhong_hanyu"},{"name":"粤语","channel_id":"public_yuzhong_yueyu"},{"channel_id":"","name":""}]
                let obj = {channel_id: '', name: ''};
                currentChannels = channelsList.slice(0, 3);
                updateChannels();
                loadSong();
            });

            //下一曲
            $('.icon-next').on('click', function(){
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
                updateChannels();
                loadSong();
            })

            //播放和暂停
            $('.play-or-pause').on('click', function(){
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
                    let tempHTML = '<li data="'+ value.channel_id +'>'+value.name+'</li>';
                    $channels.append(tempHTML);
                })
            })

            $('audio').on('canplay', function(){
                let $audio = $('audio')[0];
                duration = $audio.duration;
                time = 0;
                clock = setInterval(function(){
                    if(time >= Math.floor(duration)){
                        clearInterval(clock);
                        return;
                    }
                    time = $audio.currentTime;
                    let timeRate = Math.floor(time/duration*1000)/10 + '%';
                    $('.played').css('width', timeRate);
                    dataToTime(duration - time);
                }, 1000);

                function dataToTime(num){
                    num = Math.floor(num);
                    let sec = num%60;
                    let min = Math.floor(num/60);
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
            })

            $('audio').on('ended', function(){
                loadSong();
            })

            $('.time-line>.line').on('click', function(e){
                let position = e.pageX - $(this).offset().left;
                time = position/$(this).innerWidth()*duration;
                $('audio')[0].currentTime = time;
            })

            function updateChannels(){
                for(let i=0; i<3; i++){
                    $('.channels').children().eq(i).html(currentChannels[i].name);
                }
            }

            function loadSong(){
                clearInterval(clock);
                $('.played').css('width', '0%');
                $('.second').html('00');
                $('.minute').html('00');
                $.get('https://jirenguapi.applinzi.com/fm/getSong.php',{channel: currentChannels[1].channel_id})
                    .done(function(song){
                        currentSong = JSON.parse(song).song[0];
                        let pictureURL = currentSong.picture.substring(0,currentSong.picture.length-10);
                        $('img').attr('src', pictureURL);
                        $('.artist').html(currentSong.artist);
                        $('.title').html(currentSong.title);
                        $('audio').attr('src', currentSong.url);
                    });
            }
