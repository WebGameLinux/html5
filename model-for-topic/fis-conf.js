<!--param start-->
    //修改cdn的绝对路径（测试环境）
    fis.config.set('cdn-path','http://cms.netease.com:7111/test11/txhd_ccnxn_20141215');
    //修改cdn的绝对路径（正式环境）
    fis.config.set('cdn-path-release','http://res.txhd.netease.com/qt/2014/1215_ccnxn');
    //修改雪碧图放大缩小倍数，默认是1，iphone是0.5
    fis.config.set('css-scale',0.5);
    //修改include文件的域名
    fis.config.set('include-host','http://txhd.163.com')

    fis.config.set('pack', {
        'pkg/lib.js': [
            'src/js/lib/**.js'
        ]
    });
<!--end-->

fis.config.set('project.charset', 'gb2312');
fis.config.set('project.include', 'src/**');

fis.config.merge({
    modules : {
        parser : {
            less : 'less',
            tmpl : 'utc'
        },
        postpackager : 'simple',
        postprocessor :{
            html : 'include'
        },
        spriter : 'csssprites'
    },
    settings : {
        postpackager : {
            simple : {
                autoCombine : true
            }
        },
        postprocessor : {
            include : {
                host : fis.config.get('include-host'),
                debug : true,
                release : false,
                encode : 'gbk'
            }
        },
        spriter:  {
            csssprites : {
                margin: 1,
                //图片缩放比例，iphone为0.5，默认1
                scale: fis.config.get('css-scale'),
                layout: 'matrix'
            }
        }
    },
    roadmap : {
        ext: {
            less: 'css'
            // mp3: 'mp3'
        },
        domain : fis.config.get('cdn-path'),
        // domain : {
        //     //widget目录下的所有css文件使用 http://css1.example.com 作为域名
        //     '**.css' : fis.config.get('cdn-path'),
        //     //所有的js文件使用 http://js1.example.com 或者  http://js2.example.com 作为域名
        //     '**.js' : fis.config.get('cdn-path'),
        //     'image' : fis.config.get('cdn-path'),
        //     '**.mp3' : fis.config.get('cdn-path')
        // },
        path : [
            {
                reg : /^\/src\/.*\/(_.*)$/i,
                release : 'include/$1'
            },
            {
                reg : /^\/src\/inline\/(.*)$/i,
                release : false
            },
            {
                reg : /^\/src\/(.*\.html)$/i,
                useCache : false,
                release : '$1'
            },
            {
                reg : /^\/src\/js\/(.*\.js)$/i,
                release : 'js/$1'
            },
            {
                reg : /^\/src\/css\/(.*\.less)$/i,
                release : 'css/$1',
                useSprite: true
            },
            {
                reg : /^\/src\/css\/(.*\.css)$/i,
                release : 'css/$1',
                useSprite: true
            },
            {
                reg : /^\/src\/css\/(.*\.png)$/i,
                release : 'img/spriter/$1',
                useSprite: true
            },
            {
                reg : /^\/src\/img\/(.*)$/i,
                release : 'img/$1'
            },
            {
                reg : /^\/src\/data\/(.*)$/i,
                release : 'data/$1',
                useHash : false,
                useDomain : true
            },
            {
                reg : '**.tmpl',
                isJsLike : true,
                release : false
            },
            {
                reg : '**.js',
                release : '$&'
            },
            {
                reg : '**.css',
                release : '$&',
                useSprite: true
            },
            {
                reg : '**',
                release : false
            }
        ]
    },
    deploy : {
        dist : {
            to : './dist',
            exclude : /\/js|include\//i,
        },
        release : {
            to : './release',
            exclude : /\/js|include\//i,
            replace : {
                from : fis.config.get('cdn-path'),
                to : fis.config.get('cdn-path-release')
            }
        }
    }
});