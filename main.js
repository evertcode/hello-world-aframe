import 'aframe'
import 'aframe-look-at-component'

AFRAME.registerComponent('hotspots', {
  init: function () {
    this.el.addEventListener('reloadspots', function (event) {

      var currspotgroup = document.getElementById(event.detail.currspots)
      currspotgroup.setAttribute('scale', '0 0 0')

      var newspotgroup = document.getElementById(event.detail.newspots)
      newspotgroup.setAttribute('scale', '1 1 1')
    })
  }
})

function loadScene () {

  var sky = document.getElementById('skybox')
  sky.setAttribute('src', ndata.linkto)

  var spotcomp = document.getElementById('spots')
  var currspots = nthis.parentElement.getAttribute('id')

  spotcomp.emit('reloadspots', {
    newspots: ndata.spotgroup,
    currspots: currspots
  })

  this.emit('zoomout')

  var fp = document.getElementById('camfadeplane')
  fp.emit('camFadeOut')

}

var ndata
var nthis

AFRAME.registerComponent('spot', {
  schema: {
    linkto: { type: 'string', default: '' },
    spotgroup: { type: 'string', default: '' },
  },
  init: function () {

    //add image source of hotspot icon
    this.el.setAttribute('src', '#hotspot')
    //make the icon look at the camera all the time
    this.el.setAttribute('look-at', '#cam')

    var data = this.data

    this.el.addEventListener('click', function () {
      ndata = data
      nthis = this

      var cam = document.getElementById('cam')
      cam.emit('zoomin')

      var fp = document.getElementById('camfadeplane')
      fp.emit('camFadeIn')
    })

    this.el.addEventListener('mouseleave', function () {
      var cur = document.getElementById('cursor-visual')
      cur.emit('stopFuse')
    })

    this.el.addEventListener('mouseenter', function (event) {
      var cur = document.getElementById('cursor-visual')
      cur.emit('startFuse')
    })

  }
})

document.querySelector('#app').innerHTML = `
  <a-scene background='color: #FAFAFA'>
    
    <a-assets>
      <img id='sky1' src='/sky.jpg' alt='Sky' />
      <img id='sky2' src='/sky2.jpg' alt='Sky' />

      <img id='hotspot' src='/hotspot.png' alt='Hotspot'>
    </a-assets>

    <a-entity id='spots' hotspots>
      <a-entity id='group-sky1'>
        <a-image spot='linkto:#sky2; spotgroup:group-sky2;'
          position='-10 1 5'></a-image>
      </a-entity>
      <a-entity id='group-sky2' scale='0 0 0'>
        <a-image spot='linkto:#sky1; spotgroup:group-sky1;'
          position='-20 3 -1'></a-image>
      </a-entity>
    </a-entity>

    <a-entity
      id='cam'
      camera='fov:80'
      position='0 1.6 0'
      look-controls
      animation__zoomin='property:camera.fov; dur:2000; to:50; startEvents:zoomin;'
      animation__zoomout='property:camera.fov; dur:1000; to:80; startEvents:zoomout;'>

      <a-entity
        id='cursor-visual'
        cursor='fuse:true; fuseTimeout:2000'
        material='shader:flat; color:#023e8a'
        position='0 0 -1'
        geometry='primitive: ring; radiusInner: 0.01; radiusOuter: 0.015; thetaLength:0'
        animation__mouseenter='property: geometry.thetaLength; dir: alternate; dur: 2000; easing:
                               easeInSine; from:0;to: 360; startEvents:startFuse; pauseEvents:stopFuse; autoplay:false'
        animation__mouseleave='property: geometry.thetaLength; dir: alternate; dur: 500;
                               easing: easeInSine; to: 0;startEvents:stopFuse;autoplay:false'>
        <a-entity
          geometry='primitive:ring; radiusOuter:0.015; radiusInner:0.01'
          material='shader:flat;color:#e63946'></a-entity>
      </a-entity>

      <a-plane
        id='camfadeplane'
        rotation='10 0.5 0'
        position='0 0 -0.5'
        material='color:#000; transparent:true; opacity:0'
        width='2'
        height='2'
        animation__fadein='property:material.opacity; to:1; dur:2000; startEvents:camFadeIn;'
        animation__fadeout='property:material.opacity; to:0; dur:200; startEvents:camFadeOut;'>
      </a-plane>

    </a-entity>

    <a-sky id='skybox' src='#sky1'>
    </a-sky>

  </a-scene>
`


var ccam = document.getElementById('cam');
ccam.addEventListener('animationcomplete', loadScene);