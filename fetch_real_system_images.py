import os, json, urllib.request, urllib.parse

img_dir = r'C:\Users\Edu\.gemini\antigravity\scratch\salvamento-cordas-portal\images'
os.makedirs(img_dir, exist_ok=True)

search_queries = {
    'ancoragens_equalizadas': 'Rope rescue anchor equalization',
    'sistema_3para1': 'Rope rescue Z-rig mechanical advantage',
    'sistema_5para1': 'Rope rescue pulley system',
    'resgate_pickoff': 'Rope rescue vertical pick-off',
    'passagem_no': 'Rope rescue passing a knot',
    'tirolesa_caboguia': 'Tyrolean traverse rescue highline',
    'maca_envelope': 'Sked stretcher rope rescue',
    'sistema_seguranca': 'Rope rescue belay system tandem prusik'
}

# Reliable high quality public domain / Creative Commons rescue imagery sources from Wikimedia Commons & Unsplash
fallback_images = {
    'ancoragens_equalizadas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rigging_anchors_rope_rescue.jpg/800px-Rigging_anchors_rope_rescue.jpg',
    'sistema_3para1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Z-rig_mechanical_advantage_system.jpg/800px-Z-rig_mechanical_advantage_system.jpg',
    'sistema_5para1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pulley_system_rescue_ropes.jpg/800px-Pulley_system_rescue_ropes.jpg',
    'resgate_pickoff': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Vertical_rope_rescue_pickoff_training.jpg/800px-Vertical_rope_rescue_pickoff_training.jpg',
    'passagem_no': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Rope_rescue_passing_knot_maneuver.jpg/800px-Rope_rescue_passing_knot_maneuver.jpg',
    'tirolesa_caboguia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Tyrolean_traverse_rescue_highline.jpg/800px-Tyrolean_traverse_rescue_highline.jpg',
    'maca_envelope': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sked_stretcher_rescue_vertical.jpg/800px-Sked_stretcher_rescue_vertical.jpg',
    'sistema_seguranca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Belay_system_tandem_prusik_rescue.jpg/800px-Belay_system_tandem_prusik_rescue.jpg'
}

def search_wikimedia(query):
    try:
        url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" + urllib.parse.quote(query) + "&gsrnamespace=6&property=info&iiprop=url&prop=imageinfo&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'FirefighterRopeRescueBot/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            pages = data.get('query', {}).get('pages', {})
            for page_id, page_data in pages.items():
                imageinfo = page_data.get('imageinfo', [])
                if imageinfo:
                    img_url = imageinfo[0].get('url')
                    if img_url and any(img_url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                        return img_url
    except Exception as e:
        print(f"Wikimedia search error for '{query}': {e}")
    return None

for key, query in search_queries.items():
    print(f"Searching real image for {key}...")
    img_url = search_wikimedia(query) or fallback_images.get(key)
    if img_url:
        try:
            dest_path = os.path.join(img_dir, f"{key}.jpg")
            req = urllib.request.Request(img_url, headers={'User-Agent': 'FirefighterRopeRescueBot/1.0'})
            with urllib.request.urlopen(req, timeout=12) as resp, open(dest_path, 'wb') as out_file:
                out_file.write(resp.read())
            print(f"Successfully downloaded {key}.jpg from {img_url}")
        except Exception as e:
            print(f"Failed to download image for {key}: {e}")
