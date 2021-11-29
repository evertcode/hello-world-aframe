import 'aframe'

document.querySelector('#app').innerHTML = `
  <a-scene background='color: #FAFAFA'>
    
    <a-assets>
      <img id='sky1' src='/sky.jpg' alt='Sky' />
    </a-assets>

    <a-entity
      id='cam'
      camera='fov:80'
      position='0 1.6 0'
      look-controls>

      <a-plane
        id='camfadeplane'
        rotation='10 0.5 0'
        position='0 0 -0.5'
        material='color:#000000; transparent:true; opacity:0'
        width='2'
        height='2'
        animation__fadein='property:material.opacity; to:1; dur:2000;'
        animation__fadeout='property:material.opacity; to:0; dur:200;'>
      </a-plane>

    </a-entity>

    <a-sky id='skybox' src='#sky1'>
    </a-sky>

  </a-scene>
`
