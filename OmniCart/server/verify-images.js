// Final verification of exact product-matching Unsplash image URLs
const urls = {
  // SMARTPHONES - must show actual phones
  'phone_hand': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=500',     // hand holding phone
  'phone_dark': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=500',     // phone on dark
  'phone_iphone': 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=500',   // iphone style
  'phone_top': 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=500',      // phone top view
  'phone_multi': 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&q=80&w=500',       // iphone
  
  // HEADPHONES/AUDIO - must show headphones, earbuds, speakers
  'headphone_black': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=500', // black over-ear headphones
  'earbuds_case': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=500',    // earbuds with case
  'earbuds_white': 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&q=80&w=500',   // white earbuds
  'headphone_wood': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=500',     // headphones on wood
  'headphone_red': 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&q=80&w=500',   // red headphones

  // LAPTOPS - must show laptops/MacBooks
  'macbook_side': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=500',    // macbook from side 
  'laptop_open': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=500',     // laptop open on desk
  'laptop_angle': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=500',    // laptop from angle
  'macbook_desk': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=500',    // macbook on desk
  'laptop_dark': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=500',       // dark laptop

  // SNEAKERS - must show shoes
  'sneaker_red': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500',       // red nike sneaker
  'sneaker_white': 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=500',     // white sneakers  
  'sneaker_pair': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=500',    // sneaker pair
  'sneaker_green': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=500',   // green sneakers
  'sneaker_colorful': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=500', // colorful sneaker

  // ACTIVEWEAR
  'tshirt_grey': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',    // white/grey t-shirt hanging
  'tshirt_black': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=500',   // dark t-shirt folded
  'jogger_grey': 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=500',       // grey sweatpants/joggers
  'shorts_run': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=500',     // shorts
  'hoodie_dark': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=500',       // dark hoodie
  'tank_person': 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&q=80&w=500',     // tank top

  // CASUALS - jeans, shirts, jackets specifically
  'jeans_blue': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=500',      // blue jeans
  'jeans_stack':'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=500',       // stacked jeans/chinos  
  'shirt_formal': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=500',   // formal shirts rack
  'shirt_check': 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&q=80&w=500',     // checked shirt
  'jacket_denim': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=500',      // denim jacket
  'jacket_hang': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500',     // jacket hanging

  // HELMETS - must show actual helmets
  'helmet_moto': 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=500',       // motorcycle helmet
  'helmet_white': 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&q=80&w=500',    // white helmet
  'helmet_shelf': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=500',    // helmet on shelf/rack
  'helmet_agv': 'https://images.unsplash.com/photo-1616700835877-7d50ce087024?auto=format&fit=crop&q=80&w=500',      // colorful helmet
  'helmet_red': 'https://images.unsplash.com/photo-1614165531974-3c0c9f7e99c2?auto=format&fit=crop&q=80&w=500',      // red helmet

  // RIDING GEAR - jackets, gloves, boots for motorcyclists
  'moto_jacket': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=500',       // motorcycle jacket/rider
  'moto_rider': 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=500',      // rider with gear
  'moto_boots': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=500',      // boots
  'leather_jacket': 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&q=80&w=500',   // leather jacket
  'gloves_leather': 'https://images.unsplash.com/photo-1531746790095-e22f17593652?auto=format&fit=crop&q=80&w=500',   // leather gloves

  // BIKE ACCESSORIES
  'bike_detail': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=500',        // bike detail/mirror
  'bike_mod': 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&q=80&w=500',           // bike modification
  'bike_close': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=500',      // bike close up
  'bike_parts': 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=500',      // bike/motorcycle parts
  'bike_light': 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=500',      // motorcycle lights
};

async function testAll() {
  const results = { pass: 0, fail: 0, failed: [] };
  for (const [label, url] of Object.entries(urls)) {
    try {
      const resp = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const ok = resp.status === 200;
      console.log(`${ok ? '✅' : '❌'} ${label}: ${resp.status}`);
      if (ok) results.pass++; else { results.fail++; results.failed.push(label); }
    } catch (e) {
      console.log(`❌ ${label}: NETWORK ERROR`);
      results.fail++;
      results.failed.push(label);
    }
  }
  console.log(`\n=== Total: ${results.pass} pass, ${results.fail} fail ===`);
  if (results.failed.length > 0) console.log('Failed:', results.failed.join(', '));
}
testAll();
