<?php
session_start();

$USER = 'admin';
$PASS = 'admin123';
$FILE_PATH = 'data/projects.json';

// Handle Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

// Handle Login
if (isset($_POST['login'])) {
    if ($_POST['username'] === $USER && $_POST['password'] === $PASS) {
        $_SESSION['loggedin'] = true;
    } else {
        $error = "Invalid credentials";
    }
}

// Redirect if not logged in
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Admin Login</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="styles.css">
        <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; }
            .login-box { background: var(--glass-bg); padding: 40px; border-radius: 20px; text-align: center; border: 1px solid var(--glass-border); width: 100%; max-width: 400px; }
            input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); outline: none; background: rgba(255,255,255,0.05); color: white; }
            button { width: 100%; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="bg-orb orb-1"></div>
        <div class="login-box">
            <h2 style="color:var(--text-color);">Admin Login</h2>
            <?php if(isset($error)) echo "<p style='color:#e63946;'>$error</p>"; ?>
            <form method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit" name="login" class="btn">Login</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Helper to read JSON
function getProjects() {
    global $FILE_PATH;
    if (!file_exists($FILE_PATH)) return [];
    return json_decode(file_get_contents($FILE_PATH), true) ?: [];
}

// Helper to write JSON
function saveProjects($data) {
    global $FILE_PATH;
    file_put_contents($FILE_PATH, json_encode($data, JSON_PRETTY_PRINT));
}

// Handle Create/Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $projects = getProjects();
    
    if ($_POST['action'] === 'save') {
        $id = (int)$_POST['id'];
        
        $mediaArray = [];
        
        // Loop through multiple media entries
        if (isset($_POST['media_type']) && is_array($_POST['media_type'])) {
            $count = count($_POST['media_type']);
            for ($i = 0; $i < $count; $i++) {
                $type = $_POST['media_type'][$i];
                $url = $_POST['media_url'][$i] ?? '';
                $thumb = $_POST['media_thumb'][$i] ?? '';
                
                // Handle file upload for this index
                if (isset($_FILES['image_upload']['name'][$i]) && $_FILES['image_upload']['error'][$i] === UPLOAD_ERR_OK) {
                    $uploadDir = 'images/uploads/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    $fileName = time() . '_' . $i . '_' . basename($_FILES['image_upload']['name'][$i]);
                    $targetPath = $uploadDir . $fileName;
                    if (move_uploaded_file($_FILES['image_upload']['tmp_name'][$i], $targetPath)) {
                        $url = $targetPath;
                        $type = 'image';
                    }
                }
                
                // Only add to array if URL is successfully established
                if (!empty($url)) {
                    $mediaArray[] = [
                        'type' => $type,
                        'url' => $url,
                        'thumbnail' => $thumb
                    ];
                }
            }
        }

        // Handle card thumbnail upload
        $thumbnailUrl = trim($_POST['card_thumbnail_url'] ?? '');
        if (isset($_FILES['card_thumbnail_file']) && $_FILES['card_thumbnail_file']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'images/uploads/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            $fileName = 'thumb_' . time() . '_' . basename($_FILES['card_thumbnail_file']['name']);
            $targetPath = $uploadDir . $fileName;
            if (move_uploaded_file($_FILES['card_thumbnail_file']['tmp_name'], $targetPath)) {
                $thumbnailUrl = $targetPath;
            }
        }

        $newProject = [
            'id' => $id > 0 ? $id : (empty($projects) ? 1 : max(array_column($projects, 'id')) + 1),
            'title' => stripslashes($_POST['title']),
            'subtitle' => stripslashes($_POST['subtitle']),
            'description' => stripslashes($_POST['description']),
            'category' => stripslashes($_POST['category']),
            'technologies' => array_filter(array_map('trim', explode(',', $_POST['technologies']))),
            'codeLink' => trim($_POST['codeLink'] ?? ''),
            'codeLink2' => trim($_POST['codeLink2'] ?? ''),
            'thumbnail' => $thumbnailUrl,
            'media' => $mediaArray
        ];

        if ($id > 0) {
            foreach ($projects as &$p) {
                if ($p['id'] === $id) {
                    $p = $newProject;
                    break;
                }
            }
        } else {
            // New project is added to the end
            $projects[] = $newProject;
        }
        
        saveProjects($projects);
    } 
    // Handle Delete
    elseif ($_POST['action'] === 'delete') {
        $id = (int)$_POST['id'];
        $projects = array_filter($projects, function($p) use ($id) { return $p['id'] !== $id; });
        saveProjects(array_values($projects));
    }
    
    header("Location: admin.php");
    exit;
}

$projects = getProjects();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Portfolio Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
    <style>
        .admin-container { max-width: 1000px; margin: 50px auto; padding: 20px; z-index: 10; position: relative;}
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; background: var(--glass-bg); padding: 20px; border-radius: 16px; border: 1px solid var(--glass-border);}
        .project-list { display: flex; flex-direction: column; gap: 15px; }
        .project-item { background: rgba(13, 15, 26, 0.8); border: 1px solid var(--glass-border); padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease;}
        .project-item:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
        .form-popup { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index: 9999; justify-content: center; align-items: center; padding: 20px;}
        .form-container { background: var(--bg-color); padding: 30px; border-radius: 16px; width: 800px; max-width: 100%; border: 1px solid var(--glass-border); max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5);}
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; color: var(--text-muted); font-size: 14px;}
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); color: white; font-family: 'Inter', sans-serif;}
        .form-group select option { background: #0d0f1a; color: white; }
        .flex-btns { display: flex; gap: 15px; margin-top: 25px; }
        
        .media-block { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; gap: 15px; position:relative;}
        .media-preview-box { width: 120px; height: 120px; flex-shrink: 0; border-radius: 8px; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1);}
        .media-preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .media-preview-box span { color: #555; font-size: 12px; text-align: center; padding: 10px;}
        .media-inputs { flex-grow: 1; }
        .remove-media-btn { position: absolute; top: 10px; right: 10px; background: #e63946; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;}
    </style>
</head>
<body>
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>
    
    <div class="admin-container">
        <div class="admin-header">
            <h2 style="margin: 0; background: linear-gradient(to right, #e0aaff, #9d4edd); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dashboard</h2>
            <div>
                <button class="btn" onclick="openForm()">+ Add Project</button>
                <a href="index.html" class="btn secondary" target="_blank" style="margin-left:10px;">View Site</a>
                <a href="admin.php?logout=1" class="btn secondary" style="margin-left:10px; border-color:#e63946; color:#e63946;">Logout</a>
            </div>
        </div>

        <div class="project-list">
            <?php if(empty($projects)): ?>
                <p style="text-align:center;">No projects found.</p>
            <?php endif; ?>
            <?php foreach (array_reverse($projects) as $p): ?>
                <?php
                $thumbUrl = 'https://via.placeholder.com/80x80?text=No+Img';
                if (!empty($p['thumbnail'])) {
                    $thumbUrl = $p['thumbnail'];
                } elseif (!empty($p['media']) && count($p['media']) > 0) {
                    $m = $p['media'][0];
                    if ($m['type'] === 'image') $thumbUrl = $m['url'];
                    elseif ($m['type'] === 'video') {
                        $parts = explode('/', $m['url']);
                        $videoId = explode('?', end($parts))[0];
                        $thumbUrl = "https://img.youtube.com/vi/$videoId/default.jpg";
                    }
                    elseif ($m['type'] === 'sketchfab') $thumbUrl = !empty($m['thumbnail']) ? $m['thumbnail'] : 'https://via.placeholder.com/80?text=3D';
                }
                ?>
                <div class="project-item">
                    <div style="display:flex; align-items:center; gap: 15px;">
                        <img src="<?= htmlspecialchars($thumbUrl) ?>" alt="img" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid var(--glass-border);">
                        <div>
                            <h3 style="margin-bottom: 5px;"><?= htmlspecialchars($p['title']) ?></h3>
                            <span style="font-size:12px; padding: 3px 8px; background: var(--accent-color); border-radius: 20px;"><?= htmlspecialchars($p['category']) ?></span>
                            <?php if(!empty($p['media'])): ?>
                                <span style="font-size:12px; color: var(--text-muted); margin-left:10px;"><?= count($p['media']) ?> Media item(s)</span>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn secondary" onclick='editProject(<?= htmlspecialchars(json_encode($p), ENT_QUOTES, 'UTF-8') ?>)' style="padding: 8px 15px; font-size: 13px;">Edit</button>
                        <form method="POST" style="margin:0;" onsubmit="return confirm('Ensure you want to delete \'<?= htmlspecialchars(addslashes($p['title'])) ?>\'?');">
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="id" value="<?= $p['id'] ?>">
                            <button type="submit" class="btn" style="padding: 8px 15px; font-size: 13px; background:#e63946; border:none; box-shadow:none;">Delete</button>
                        </form>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Modal Form -->
    <div class="form-popup" id="projectFormModal">
        <div class="form-container">
            <h2 id="formTitle" style="margin-bottom: 20px;">Add Project</h2>
            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="save">
                <input type="hidden" name="id" id="projectId" value="0">
                
                <div style="display: flex; gap: 20px;">
                    <div style="flex: 1;">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" name="title" id="pTitle" required>
                        </div>
                        <div class="form-group">
                            <label>Subtitle / Short Desc</label>
                            <input type="text" name="subtitle" id="pSubtitle">
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select name="category" id="pCategory" required>
                                <option value="vr">VR Projects</option>
                                <option value="3d">3D Models</option>
                                <option value="game">Game Development</option>
                                <option value="Video">Animation Video</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>GitHub Link (Optional)</label>
                            <input type="text" name="codeLink" id="pCodeLink" placeholder="https://github.com/...">
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <div class="form-group">
                            <label>Description</label>
                            <textarea name="description" id="pDesc" rows="5"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Technologies (comma separated)</label>
                            <input type="text" name="technologies" id="pTech" placeholder="e.g. Unity, Blender, C#">
                        </div>
                        <div class="form-group">
                            <label>Behance Link (Optional)</label>
                            <input type="text" name="codeLink2" id="pCodeLink2" placeholder="https://behance.net/...">
                        </div>
                    </div>
                </div>
                
                <h3 style="margin-top: 20px; font-size: 18px; border-bottom: 1px solid var(--glass-border); padding-bottom: 10px;">Card Thumbnail</h3>
                <div style="display:flex; gap:20px; align-items:flex-start; background:rgba(255,255,255,0.03); border:1px solid var(--glass-border); border-radius:8px; padding:15px; margin-bottom:15px;">
                    <div id="card-thumb-preview" style="width:120px; height:120px; flex-shrink:0; border-radius:8px; background:#000; overflow:hidden; display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.1);">
                        <span style="color:#555; font-size:12px; text-align:center; padding:10px;">No Preview</span>
                    </div>
                    <div style="flex:1;">
                        <div class="form-group">
                            <label>Upload Thumbnail Image</label>
                            <input type="file" name="card_thumbnail_file" accept="image/*" style="padding:9px;" onchange="previewCardThumb(this)">
                            <small style="color:#888; font-size:11px; margin-top:4px; display:block;">Recommended resolution: <strong style="color:#aaa;">600 × 400 px</strong> (3:2 ratio) — minimum 300 × 200 px, max 2 MB.</small>
                        </div>
                        <div class="form-group">
                            <label>Or Thumbnail URL</label>
                            <input type="text" name="card_thumbnail_url" id="pCardThumbUrl" placeholder="https://..." onchange="previewCardThumbUrl(this)">
                        </div>
                    </div>
                </div>

                <h3 style="margin-top: 20px; font-size: 18px; border-bottom: 1px solid var(--glass-border); padding-bottom: 10px;">Media Gallery</h3>
                
                <div id="media-container">
                    <!-- Media block template gets inserted here -->
                </div>
                
                <button type="button" class="btn secondary" onclick="addMediaRow()" style="margin-top:10px; width: 100%; border-style: dashed;">+ Add Another Media Item</button>
                
                <div class="flex-btns" style="margin-top: 30px;">
                    <button type="submit" class="btn" style="flex:1; font-size:16px;">Save Project</button>
                    <button type="button" class="btn secondary" style="flex:1; font-size:16px;" onclick="closeForm()">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let mediaIndex = 0;

        // Add a new media row, populating it if data is passed
        function addMediaRow(mediaData = null) {
            const container = document.getElementById('media-container');
            const currentIndex = mediaIndex++;
            
            const div = document.createElement('div');
            div.className = 'media-block';
            div.id = 'media-block-' + currentIndex;
            
            let previewImg = mediaData && mediaData.url ? `<img src="${mediaData.url}" />` : `<span>No Preview</span>`;
            if (mediaData && mediaData.type === 'video') {
                const vidId = mediaData.url.split('/').pop().split('?')[0];
                previewImg = `<img src="https://img.youtube.com/vi/${vidId}/default.jpg" />`;
            } else if (mediaData && mediaData.type === 'sketchfab') {
                previewImg = mediaData.thumbnail ? `<img src="${mediaData.thumbnail}" />` : `<span>Sketchfab (3D)</span>`;
            }

            const type = mediaData ? mediaData.type : 'image';
            const urlValue = mediaData ? mediaData.url : '';
            const thumbValue = mediaData ? (mediaData.thumbnail || '') : '';
            
            div.innerHTML = `
                <button type="button" class="remove-media-btn" onclick="document.getElementById('media-block-${currentIndex}').remove()">X Remove</button>
                
                <div class="media-preview-box" id="preview-box-${currentIndex}">
                    ${previewImg}
                </div>
                
                <div class="media-inputs">
                    <div style="display:flex; gap:10px;">
                        <div class="form-group" style="flex:1;">
                            <label>Media Type</label>
                            <select name="media_type[]" id="type-${currentIndex}" onchange="toggleMedia(${currentIndex})">
                                <option value="image" ${type==='image'?'selected':''}>Image</option>
                                <option value="video" ${type==='video'?'selected':''}>YouTube Video</option>
                                <option value="sketchfab" ${type==='sketchfab'?'selected':''}>Sketchfab Embed</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex:2;" id="upload-group-${currentIndex}">
                            <label>Upload File (Image only)</label>
                            <input type="file" name="image_upload[]" accept="image/*" style="padding: 9px;" onchange="previewFile(this, ${currentIndex})">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Or Web URL (Embed link or External Image)</label>
                        <input type="text" name="media_url[]" value="${urlValue}" placeholder="https://..." onchange="previewUrl(this, ${currentIndex})">
                    </div>
                    
                    <div class="form-group" id="thumb-group-${currentIndex}">
                        <label>Thumbnail URL (Optional for 3D/Video)</label>
                        <input type="text" name="media_thumb[]" value="${thumbValue}">
                    </div>
                </div>
            `;
            
            container.appendChild(div);
            toggleMedia(currentIndex);
        }

        function toggleMedia(index) {
            const type = document.getElementById('type-' + index).value;
            const uploadGrp = document.getElementById('upload-group-' + index);
            if (type === 'image') {
                uploadGrp.style.display = 'block';
            } else {
                uploadGrp.style.display = 'none';
            }
        }

        function previewFile(input, index) {
            const previewBox = document.getElementById('preview-box-' + index);
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewBox.innerHTML = `<img src="${e.target.result}" />`;
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function previewUrl(input, index) {
            const previewBox = document.getElementById('preview-box-' + index);
            const val = input.value;
            const type = document.getElementById('type-' + index).value;
            if(!val) return;

            if (type === 'image') {
                previewBox.innerHTML = `<img src="${val}" />`;
            } else if (type === 'video') {
                const vidId = val.split('/').pop().split('?')[0];
                previewBox.innerHTML = `<img src="https://img.youtube.com/vi/${vidId}/default.jpg" />`;
            } else {
                previewBox.innerHTML = `<span>Preview Unvailable</span>`;
            }
        }

        function previewCardThumb(input) {
            const box = document.getElementById('card-thumb-preview');
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = e => { box.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">`; };
                reader.readAsDataURL(input.files[0]);
            }
        }

        function previewCardThumbUrl(input) {
            const box = document.getElementById('card-thumb-preview');
            if (input.value) {
                box.innerHTML = `<img src="${input.value}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<span style=color:#555;font-size:12px;text-align:center;padding:10px>Bad URL</span>'">`;
            } else {
                box.innerHTML = `<span style="color:#555;font-size:12px;text-align:center;padding:10px">No Preview</span>`;
            }
        }

        function openForm() {
            document.getElementById('projectFormModal').style.display = 'flex';
            document.getElementById('formTitle').innerText = 'Add Project';
            document.getElementById('projectId').value = '0';
            document.getElementById('pTitle').value = '';
            document.getElementById('pSubtitle').value = '';
            document.getElementById('pCategory').value = 'vr';
            document.getElementById('pDesc').value = '';
            document.getElementById('pTech').value = '';
            document.getElementById('pCodeLink').value = '';
            document.getElementById('pCodeLink2').value = '';
            document.getElementById('pCardThumbUrl').value = '';
            document.getElementById('card-thumb-preview').innerHTML = '<span style="color:#555;font-size:12px;text-align:center;padding:10px">No Preview</span>';

            document.getElementById('media-container').innerHTML = '';
            addMediaRow(); // Add an empty row to start
        }

        function editProject(p) {
            openForm();
            document.getElementById('formTitle').innerText = 'Edit Project';
            document.getElementById('projectId').value = p.id;
            document.getElementById('pTitle').value = p.title || '';
            document.getElementById('pSubtitle').value = p.subtitle || '';
            document.getElementById('pCategory').value = p.category || 'vr';
            document.getElementById('pDesc').value = p.description || '';
            document.getElementById('pTech').value = (p.technologies || []).join(', ');
            document.getElementById('pCodeLink').value = p.codeLink || '';
            document.getElementById('pCodeLink2').value = p.codeLink2 || '';

            // Populate card thumbnail
            const thumbUrl = p.thumbnail || '';
            document.getElementById('pCardThumbUrl').value = thumbUrl;
            const box = document.getElementById('card-thumb-preview');
            if (thumbUrl) {
                box.innerHTML = `<img src="${thumbUrl}" style="width:100%;height:100%;object-fit:cover;">`;
            } else {
                box.innerHTML = '<span style="color:#555;font-size:12px;text-align:center;padding:10px">No Preview</span>';
            }

            // Populate media rows
            document.getElementById('media-container').innerHTML = ''; // clear initial empty row
            if (p.media && p.media.length > 0) {
                p.media.forEach(m => addMediaRow(m));
            } else {
                addMediaRow(); // Fallback empty row if none
            }
        }

        function closeForm() {
            document.getElementById('projectFormModal').style.display = 'none';
        }
    </script>
</body>
</html>
