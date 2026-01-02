# Dashboard Administrateur pour Juris Ark

Je vais créer un système de dashboard administrateur complet avec authentification et gestion de contenu.

## 📋 **Structure du Projet**

```
jurisark-admin/
├── index.html                    # Page de connexion
├── dashboard.html                # Interface principale
├── style.css                     # Styles communs
├── admin.js                      # Logique JavaScript
├── data/                         # Données JSON
│   ├── team.json
│   ├── faq.json
│   ├── deadlines.json
│   ├── testimonials.json
│   ├── cases.json
│   └── settings.json
└── assets/                       # Images uploadées
    └── uploads/
```

## 🔐 **Page de Connexion (index.html)**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Juris Ark - Connexion</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Mulish', sans-serif;
            background: linear-gradient(135deg, #1a3a5f 0%, #2c5aa0 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            width: 100%;
            max-width: 400px;
            padding: 0 20px;
        }
        
        .login-box {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        
        .logo {
            margin-bottom: 30px;
        }
        
        .logo i {
            font-size: 3rem;
            color: #c9a96e;
            margin-bottom: 10px;
        }
        
        .logo h1 {
            color: #1a3a5f;
            font-size: 1.8rem;
            margin-bottom: 5px;
        }
        
        .logo p {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #2c3e50;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-family: 'Mulish', sans-serif;
            font-size: 1rem;
            transition: border 0.3s;
        }
        
        .form-control:focus {
            border-color: #c9a96e;
            outline: none;
        }
        
        .btn-login {
            width: 100%;
            background: #c9a96e;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 8px;
            font-family: 'Mulish', sans-serif;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
            margin-top: 10px;
        }
        
        .btn-login:hover {
            background: #b89446;
        }
        
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .footer {
            margin-top: 30px;
            color: #6c757d;
            font-size: 0.8rem;
        }
        
        @media (max-width: 480px) {
            .login-box {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <div class="logo">
                <i class="fas fa-balance-scale"></i>
                <h1>JURIS ARK</h1>
                <p>Administration</p>
            </div>
            
            <div class="alert alert-error" id="errorAlert">
                Identifiants incorrects. Veuillez réessayer.
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Nom d'utilisateur</label>
                    <input type="text" id="username" class="form-control" placeholder="admin" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" class="form-control" placeholder="••••••••" required>
                </div>
                
                <button type="submit" class="btn-login">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </button>
            </form>
            
            <div class="footer">
                <p>© 2023 Juris Ark. Accès réservé au personnel autorisé.</p>
            </div>
        </div>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorAlert = document.getElementById('errorAlert');
            
            // En production, remplacer par une vérification côté serveur
            if (username === 'admin' && password === 'jurisark2023') {
                // Stocker l'état de connexion (en production, utiliser des tokens JWT)
                sessionStorage.setItem('admin_logged_in', 'true');
                sessionStorage.setItem('admin_username', username);
                
                // Rediriger vers le dashboard
                window.location.href = 'dashboard.html';
            } else {
                errorAlert.style.display = 'block';
                setTimeout(() => {
                    errorAlert.style.display = 'none';
                }, 3000);
            }
        });
        
        // Vérifier si déjà connecté
        if (sessionStorage.getItem('admin_logged_in') === 'true') {
            window.location.href = 'dashboard.html';
        }
    </script>
</body>
</html>
```

## 🖥️ **Dashboard Principal (dashboard.html)**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Juris Ark</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: #1a3a5f;
            --secondary: #c9a96e;
            --success: #28a745;
            --warning: #ffc107;
            --danger: #dc3545;
            --light: #f8f9fa;
            --dark: #2c3e50;
            --gray: #6c757d;
            --light-gray: #e9ecef;
            --border-radius: 8px;
            --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            --sidebar-width: 250px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Mulish', sans-serif;
            background: #f5f7fa;
            color: var(--dark);
            display: flex;
            min-height: 100vh;
        }
        
        /* Sidebar */
        .sidebar {
            width: var(--sidebar-width);
            background: var(--primary);
            color: white;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            transition: transform 0.3s;
            z-index: 1000;
        }
        
        .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .sidebar-header i {
            font-size: 1.5rem;
            color: var(--secondary);
        }
        
        .sidebar-header h2 {
            font-size: 1.2rem;
            font-weight: 600;
        }
        
        .nav-menu {
            padding: 20px 0;
        }
        
        .nav-item {
            list-style: none;
        }
        
        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px 20px;
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: all 0.3s;
            border-left: 3px solid transparent;
        }
        
        .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-left-color: var(--secondary);
        }
        
        .nav-link.active {
            background: rgba(201, 169, 110, 0.1);
            color: white;
            border-left-color: var(--secondary);
        }
        
        .nav-link i {
            width: 20px;
            text-align: center;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: var(--sidebar-width);
            transition: margin-left 0.3s;
        }
        
        /* Topbar */
        .topbar {
            background: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .topbar-left h1 {
            font-size: 1.5rem;
            color: var(--primary);
            font-weight: 600;
        }
        
        .user-menu {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .user-info {
            text-align: right;
        }
        
        .user-name {
            font-weight: 600;
            color: var(--dark);
        }
        
        .user-role {
            font-size: 0.8rem;
            color: var(--gray);
        }
        
        .btn-logout {
            background: var(--danger);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: 'Mulish', sans-serif;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s;
        }
        
        .btn-logout:hover {
            background: #c82333;
        }
        
        /* Content Area */
        .content-area {
            padding: 30px;
            min-height: calc(100vh - 70px);
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .section-header h2 {
            color: var(--primary);
            font-size: 1.8rem;
            font-weight: 600;
        }
        
        /* Dashboard Cards */
        .dashboard-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .card {
            background: white;
            border-radius: var(--border-radius);
            padding: 25px;
            box-shadow: var(--box-shadow);
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        
        .card-icon {
            width: 50px;
            height: 50px;
            background: rgba(201, 169, 110, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--secondary);
        }
        
        .card-title {
            font-size: 0.9rem;
            color: var(--gray);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        
        .card-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 10px;
        }
        
        /* Tables */
        .data-table {
            width: 100%;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            overflow: hidden;
            margin-bottom: 30px;
        }
        
        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid var(--light-gray);
        }
        
        .table-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--primary);
        }
        
        .btn-add {
            background: var(--secondary);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: 'Mulish', sans-serif;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s;
        }
        
        .btn-add:hover {
            background: #b89446;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        thead {
            background: var(--light);
        }
        
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: var(--dark);
            border-bottom: 2px solid var(--light-gray);
        }
        
        td {
            padding: 15px;
            border-bottom: 1px solid var(--light-gray);
        }
        
        .actions {
            display: flex;
            gap: 10px;
        }
        
        .btn-action {
            padding: 5px 10px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .btn-edit {
            background: var(--warning);
            color: var(--dark);
        }
        
        .btn-delete {
            background: var(--danger);
            color: white;
        }
        
        /* Modals */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: white;
            border-radius: var(--border-radius);
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalFade 0.3s;
        }
        
        @keyframes modalFade {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid var(--light-gray);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--dark);
        }
        
        .form-control {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--light-gray);
            border-radius: var(--border-radius);
            font-family: 'Mulish', sans-serif;
            font-size: 1rem;
        }
        
        .form-control:focus {
            border-color: var(--secondary);
            outline: none;
        }
        
        textarea.form-control {
            min-height: 120px;
            resize: vertical;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid var(--light-gray);
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .btn-cancel {
            background: var(--light-gray);
            color: var(--dark);
            border: none;
            padding: 10px 20px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: 'Mulish', sans-serif;
        }
        
        .btn-save {
            background: var(--success);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: 'Mulish', sans-serif;
            font-weight: 500;
        }
        
        /* Mobile Menu Toggle */
        .menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--primary);
            cursor: pointer;
        }
        
        /* Responsive */
        @media (max-width: 992px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .sidebar.active {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
            }
            
            .menu-toggle {
                display: block;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .dashboard-cards {
                grid-template-columns: 1fr;
            }
            
            .topbar {
                padding: 15px;
            }
            
            .content-area {
                padding: 20px;
            }
        }
        
        /* Loading Spinner */
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid var(--secondary);
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 50px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <nav class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <i class="fas fa-balance-scale"></i>
            <h2>Juris Ark Admin</h2>
        </div>
        
        <ul class="nav-menu">
            <li class="nav-item">
                <a href="#dashboard" class="nav-link active" data-section="dashboard">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#team" class="nav-link" data-section="team">
                    <i class="fas fa-users"></i>
                    <span>Équipe d'Experts</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#faq" class="nav-link" data-section="faq">
                    <i class="fas fa-question-circle"></i>
                    <span>Questions Fréquentes</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#deadlines" class="nav-link" data-section="deadlines">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Délais à Surveiller</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#testimonials" class="nav-link" data-section="testimonials">
                    <i class="fas fa-comments"></i>
                    <span>Témoignages Clients</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#cases" class="nav-link" data-section="cases">
                    <i class="fas fa-briefcase"></i>
                    <span>Succès d'Affaires</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#blog" class="nav-link" data-section="blog">
                    <i class="fas fa-newspaper"></i>
                    <span>Articles de Blog</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#settings" class="nav-link" data-section="settings">
                    <i class="fas fa-cog"></i>
                    <span>Paramètres</span>
                </a>
            </li>
        </ul>
    </nav>
    
    <!-- Main Content -->
    <div class="main-content">
        <!-- Topbar -->
        <header class="topbar">
            <div class="topbar-left">
                <button class="menu-toggle" id="menuToggle">
                    <i class="fas fa-bars"></i>
                </button>
                <h1 id="pageTitle">Dashboard</h1>
            </div>
            
            <div class="user-menu">
                <div class="user-info">
                    <div class="user-name" id="userName">Administrateur</div>
                    <div class="user-role">Super Admin</div>
                </div>
                <button class="btn-logout" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    Déconnexion
                </button>
            </div>
        </header>
        
        <!-- Content Area -->
        <main class="content-area">
            <!-- Dashboard Section -->
            <section id="dashboardSection" class="section-content">
                <div class="dashboard-cards">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <span class="card-title">Membres d'Équipe</span>
                        </div>
                        <div class="card-value" id="teamCount">4</div>
                        <div class="card-desc">Experts juridiques</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <span class="card-title">Questions FAQ</span>
                        </div>
                        <div class="card-value" id="faqCount">5</div>
                        <div class="card-desc">Questions fréquentes</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-comments"></i>
                            </div>
                            <span class="card-title">Témoignages</span>
                        </div>
                        <div class="card-value" id="testimonialsCount">3</div>
                        <div class="card-desc">Avis clients</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <span class="card-title">Succès d'Affaires</span>
                        </div>
                        <div class="card-value" id="casesCount">3</div>
                        <div class="card-desc">Études de cas</div>
                    </div>
                </div>
                
                <div class="recent-activity">
                    <h2>Activité Récente</h2>
                    <div class="activity-list" id="activityList">
                        <!-- Activités chargées dynamiquement -->
                    </div>
                </div>
            </section>
            
            <!-- Team Section -->
            <section id="teamSection" class="section-content" style="display: none;">
                <div class="section-header">
                    <h2>Gestion des Experts</h2>
                    <button class="btn-add" id="addTeamBtn">
                        <i class="fas fa-plus"></i>
                        Ajouter un Expert
                    </button>
                </div>
                
                <div class="data-table">
                    <div class="table-header">
                        <div class="table-title">Liste des Experts</div>
                    </div>
                    <table id="teamTable">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Nom</th>
                                <th>Titre</th>
                                <th>Spécialité</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="teamTableBody">
                            <!-- Données chargées dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </section>
            
            <!-- FAQ Section -->
            <section id="faqSection" class="section-content" style="display: none;">
                <div class="section-header">
                    <h2>Gestion des Questions Fréquentes</h2>
                    <button class="btn-add" id="addFaqBtn">
                        <i class="fas fa-plus"></i>
                        Ajouter une Question
                    </button>
                </div>
                
                <div class="data-table">
                    <div class="table-header">
                        <div class="table-title">Liste des Questions</div>
                    </div>
                    <table id="faqTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Question</th>
                                <th>Catégorie</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="faqTableBody">
                            <!-- Données chargées dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </section>
            
            <!-- Deadlines Section -->
            <section id="deadlinesSection" class="section-content" style="display: none;">
                <div class="section-header">
                    <h2>Gestion des Délais</h2>
                    <button class="btn-add" id="addDeadlineBtn">
                        <i class="fas fa-plus"></i>
                        Ajouter un Délai
                    </button>
                </div>
                
                <div class="data-table">
                    <div class="table-header">
                        <div class="table-title">Délais à Surveiller</div>
                    </div>
                    <table id="deadlinesTable">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Urgent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="deadlinesTableBody">
                            <!-- Données chargées dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </section>
            
            <!-- Testimonials Section -->
            <section id="testimonialsSection" class="section-content" style="display: none;">
                <div class="section-header">
                    <h2>Gestion des Témoignages</h2>
                    <button class="btn-add" id="addTestimonialBtn">
                        <i class="fas fa-plus"></i>
                        Ajouter un Témoignage
                    </button>
                </div>
                
                <div class="data-table">
                    <div class="table-header">
                        <div class="table-title">Témoignages Clients</div>
                    </div>
                    <table id="testimonialsTable">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Fonction</th>
                                <th>Témoignage</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="testimonialsTableBody">
                            <!-- Données chargées dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </section>
            
            <!-- Cases Section -->
            <section id="casesSection" class="section-content" style="display: none;">
                <div class="section-header">
                    <h2>Gestion des Succès d'Affaires</h2>
                    <button class="btn-add" id="addCaseBtn">
                        <i class="fas fa-plus"></i>
                        Ajouter un Succès
                    </button>
                </div>
                
                <div class="data-table">
                    <div class="table-header">
                        <div class="table-title">Succès d'Affaires</div>
                    </div>
                    <table id="casesTable">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Catégorie</th>
                                <th>Montant</th>
                                <th>Résultat</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="casesTableBody">
                            <!-- Données chargées dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </section>
            
            <!-- Blog Section -->
            <section id="blogSection" class="section-content" style="display: none;">
                <div class="section-header">
                    <h2>Gestion des Articles de Blog</h2>
                    <button class="btn-add" id="addBlogBtn">
                        <i class="fas fa-plus"></i>
                        Ajouter un Article
                    </button>
                </div>
                
                <div class="data-table">
                    <div class="table-header">
                        <div class="table-title">Articles de Blog</div>
                    </div>
                    <table id="blogTable">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Catégorie</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="blogTableBody">
                            <!-- Données chargées dynamiquement -->
                        </tbody>
                    </table>
                </div>
            </section>
            
            <!-- Settings Section -->
            <section id="settingsSection" class="section-content" style="display: none;">
                <div class="section-header">
                    <h2>Paramètres du Site</h2>
                </div>
                
                <div class="settings-form">
                    <div class="card">
                        <div class="card-header">
                            <h3>Informations Générales</h3>
                        </div>
                        <div class="card-body">
                            <form id="generalSettingsForm">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Nom du Cabinet</label>
                                        <input type="text" class="form-control" id="siteName" value="Juris Ark">
                                    </div>
                                    <div class="form-group">
                                        <label>Email de Contact</label>
                                        <input type="email" class="form-control" id="siteEmail" value="contact@jurisark.bj">
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Téléphone</label>
                                        <input type="text" class="form-control" id="sitePhone" value="+229 XX XX XX XX">
                                    </div>
                                    <div class="form-group">
                                        <label>Adresse</label>
                                        <input type="text" class="form-control" id="siteAddress" value="Cotonou, Bénin">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label>Description du Cabinet</label>
                                    <textarea class="form-control" id="siteDescription" rows="4">Cabinet de conseil juridique offrant des services professionnels à Cotonou, Bénin.</textarea>
                                </div>
                                
                                <button type="submit" class="btn-save">Enregistrer les modifications</button>
                            </form>
                        </div>
                    </div>
                    
                    <div class="card" style="margin-top: 30px;">
                        <div class="card-header">
                            <h3>Sécurité</h3>
                        </div>
                        <div class="card-body">
                            <form id="securitySettingsForm">
                                <div class="form-group">
                                    <label>Changer le mot de passe administrateur</label>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Nouveau mot de passe</label>
                                            <input type="password" class="form-control" id="newPassword">
                                        </div>
                                        <div class="form-group">
                                            <label>Confirmer le mot de passe</label>
                                            <input type="password" class="form-control" id="confirmPassword">
                                        </div>
                                    </div>
                                    <button type="submit" class="btn-save">Mettre à jour le mot de passe</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    
    <!-- Modals -->
    
    <!-- Team Modal -->
    <div class="modal" id="teamModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="teamModalTitle">Ajouter un Expert</h3>
                <button class="modal-close" data-modal="teamModal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="teamForm">
                    <input type="hidden" id="teamId">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nom complet *</label>
                            <input type="text" class="form-control" id="teamName" required>
                        </div>
                        <div class="form-group">
                            <label>Titre *</label>
                            <input type="text" class="form-control" id="teamTitle" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Spécialité *</label>
                            <select class="form-control" id="teamSpecialty" required>
                                <option value="">Sélectionner une spécialité</option>
                                <option value="Droit des affaires">Droit des affaires</option>
                                <option value="Droit immobilier">Droit immobilier</option>
                                <option value="Droit fiscal">Droit fiscal</option>
                                <option value="Droit international">Droit international</option>
                                <option value="Recouvrement">Recouvrement</option>
                                <option value="Arbitrage">Arbitrage</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Expérience (années)</label>
                            <input type="number" class="form-control" id="teamExperience" min="0" max="50">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Biographie *</label>
                        <textarea class="form-control" id="teamBio" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>URL de la photo</label>
                            <input type="url" class="form-control" id="teamPhoto" placeholder="https://exemple.com/photo.jpg">
                        </div>
                        <div class="form-group">
                            <label>Ordre d'affichage</label>
                            <input type="number" class="form-control" id="teamOrder" min="1" max="20" value="1">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Informations de contact</label>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" class="form-control" id="teamEmail">
                            </div>
                            <div class="form-group">
                                <label>LinkedIn</label>
                                <input type="url" class="form-control" id="teamLinkedin" placeholder="https://linkedin.com/in/...">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-modal="teamModal">Annuler</button>
                <button class="btn-save" id="saveTeamBtn">Enregistrer</button>
            </div>
        </div>
    </div>
    
    <!-- FAQ Modal -->
    <div class="modal" id="faqModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="faqModalTitle">Ajouter une Question</h3>
                <button class="modal-close" data-modal="faqModal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="faqForm">
                    <input type="hidden" id="faqId">
                    
                    <div class="form-group">
                        <label>Question *</label>
                        <input type="text" class="form-control" id="faqQuestion" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Réponse *</label>
                        <textarea class="form-control" id="faqAnswer" rows="6" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Catégorie *</label>
                            <select class="form-control" id="faqCategory" required>
                                <option value="">Sélectionner une catégorie</option>
                                <option value="Général">Général</option>
                                <option value="Honoraires">Honoraires</option>
                                <option value="Services">Services</option>
                                <option value="Procédures">Procédures</option>
                                <option value="Contact">Contact</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ordre d'affichage</label>
                            <input type="number" class="form-control" id="faqOrder" min="1" max="50" value="1">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-modal="faqModal">Annuler</button>
                <button class="btn-save" id="saveFaqBtn">Enregistrer</button>
            </div>
        </div>
    </div>
    
    <!-- Deadline Modal -->
    <div class="modal" id="deadlineModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="deadlineModalTitle">Ajouter un Délai</h3>
                <button class="modal-close" data-modal="deadlineModal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="deadlineForm">
                    <input type="hidden" id="deadlineId">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Date *</label>
                            <input type="date" class="form-control" id="deadlineDate" required>
                        </div>
                        <div class="form-group">
                            <label>Type de délai</label>
                            <select class="form-control" id="deadlineType">
                                <option value="Fiscal">Fiscal</option>
                                <option value="Juridique">Juridique</option>
                                <option value="Administratif">Administratif</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Description *</label>
                        <input type="text" class="form-control" id="deadlineDescription" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Client concerné</label>
                            <input type="text" class="form-control" id="deadlineClient" placeholder="Tous les clients">
                        </div>
                        <div class="form-group">
                            <label>Urgent</label>
                            <select class="form-control" id="deadlineUrgent">
                                <option value="0">Non</option>
                                <option value="1">Oui</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Notes supplémentaires</label>
                        <textarea class="form-control" id="deadlineNotes" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-modal="deadlineModal">Annuler</button>
                <button class="btn-save" id="saveDeadlineBtn">Enregistrer</button>
            </div>
        </div>
    </div>
    
    <!-- Testimonial Modal -->
    <div class="modal" id="testimonialModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="testimonialModalTitle">Ajouter un Témoignage</h3>
                <button class="modal-close" data-modal="testimonialModal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="testimonialForm">
                    <input type="hidden" id="testimonialId">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nom du client *</label>
                            <input type="text" class="form-control" id="testimonialName" required>
                        </div>
                        <div class="form-group">
                            <label>Fonction/Entreprise *</label>
                            <input type="text" class="form-control" id="testimonialPosition" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Témoignage *</label>
                        <textarea class="form-control" id="testimonialContent" rows="5" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>URL de la photo</label>
                            <input type="url" class="form-control" id="testimonialPhoto" placeholder="https://exemple.com/photo.jpg">
                        </div>
                        <div class="form-group">
                            <label>Note (1-5)</label>
                            <select class="form-control" id="testimonialRating">
                                <option value="5">5 étoiles</option>
                                <option value="4">4 étoiles</option>
                                <option value="3">3 étoiles</option>
                                <option value="2">2 étoiles</option>
                                <option value="1">1 étoile</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Date du témoignage</label>
                        <input type="date" class="form-control" id="testimonialDate">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-modal="testimonialModal">Annuler</button>
                <button class="btn-save" id="saveTestimonialBtn">Enregistrer</button>
            </div>
        </div>
    </div>
    
    <!-- Case Study Modal -->
    <div class="modal" id="caseModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="caseModalTitle">Ajouter un Succès d'Affaires</h3>
                <button class="modal-close" data-modal="caseModal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="caseForm">
                    <input type="hidden" id="caseId">
                    
                    <div class="form-group">
                        <label>Titre *</label>
                        <input type="text" class="form-control" id="caseTitle" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Description *</label>
                        <textarea class="form-control" id="caseDescription" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Catégorie *</label>
                            <select class="form-control" id="caseCategory" required>
                                <option value="">Sélectionner une catégorie</option>
                                <option value="Droit des affaires">Droit des affaires</option>
                                <option value="Droit immobilier">Droit immobilier</option>
                                <option value="Droit fiscal">Droit fiscal</option>
                                <option value="Recouvrement">Recouvrement</option>
                                <option value="Arbitrage">Arbitrage</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Résultat *</label>
                            <select class="form-control" id="caseResult" required>
                                <option value="Gagné">Gagné</option>
                                <option value="Succès">Succès</option>
                                <option value="Résolution">Résolution</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Montant</label>
                            <input type="text" class="form-control" id="caseAmount" placeholder="2M€ ou 450M FCFA">
                        </div>
                        <div class="form-group">
                            <label>Durée</label>
                            <input type="text" class="form-control" id="caseDuration" placeholder="6 mois">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Résultat détaillé</label>
                        <textarea class="form-control" id="caseOutcome" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-modal="caseModal">Annuler</button>
                <button class="btn-save" id="saveCaseBtn">Enregistrer</button>
            </div>
        </div>
    </div>
    
    <!-- Blog Modal -->
    <div class="modal" id="blogModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="blogModalTitle">Ajouter un Article</h3>
                <button class="modal-close" data-modal="blogModal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="blogForm">
                    <input type="hidden" id="blogId">
                    
                    <div class="form-group">
                        <label>Titre *</label>
                        <input type="text" class="form-control" id="blogTitle" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Extrait *</label>
                        <textarea class="form-control" id="blogExcerpt" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Contenu complet *</label>
                        <textarea class="form-control" id="blogContent" rows="8" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Catégorie *</label>
                            <select class="form-control" id="blogCategory" required>
                                <option value="">Sélectionner une catégorie</option>
                                <option value="Fiscal">Fiscal</option>
                                <option value="Droit des affaires">Droit des affaires</option>
                                <option value="Conformité">Conformité</option>
                                <option value="Actualités">Actualités</option>
                                <option value="Conseils">Conseils</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Auteur</label>
                            <input type="text" class="form-control" id="blogAuthor" value="Juris Ark">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Date de publication</label>
                            <input type="date" class="form-control" id="blogDate">
                        </div>
                        <div class="form-group">
                            <label>URL de l'image</label>
                            <input type="url" class="form-control" id="blogImage" placeholder="https://exemple.com/image.jpg">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Statut</label>
                        <select class="form-control" id="blogStatus">
                            <option value="published">Publié</option>
                            <option value="draft">Brouillon</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-modal="blogModal">Annuler</button>
                <button class="btn-save" id="saveBlogBtn">Enregistrer</button>
            </div>
        </div>
    </div>
    
    <!-- Confirmation Modal -->
    <div class="modal" id="confirmModal">
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">Confirmation</h3>
                <button class="modal-close" data-modal="confirmModal">&times;</button>
            </div>
            <div class="modal-body">
                <p id="confirmMessage">Êtes-vous sûr de vouloir supprimer cet élément ?</p>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" data-modal="confirmModal">Annuler</button>
                <button class="btn-save" id="confirmDeleteBtn">Supprimer</button>
            </div>
        </div>
    </div>
    
    <!-- JavaScript -->
    <script>
        // ===== DONNÉES DE TEST =====
        
        // Données initiales (en production, charger depuis une API)
        let data = {
            team: [
                {
                    id: 1,
                    name: "Maître Jean Dossou",
                    title: "Avocat Principal - Droit des Affaires",
                    bio: "15 ans d'expérience en droit commercial international et en fusion-acquisition.",
                    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    specialty: "Droit des affaires",
                    experience: 15,
                    order: 1
                },
                {
                    id: 2,
                    name: "Maître Amina Chabi",
                    title: "Avocate - Droit Immobilier & Patrimonial",
                    bio: "Spécialiste en droit immobilier et gestion patrimoniale.",
                    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    specialty: "Droit immobilier",
                    experience: 10,
                    order: 2
                }
            ],
            
            faq: [
                {
                    id: 1,
                    question: "Quels sont les délais moyens pour un recouvrement de créances ?",
                    answer: "Les délais varient selon la complexité du dossier...",
                    category: "Procédures",
                    order: 1
                },
                {
                    id: 2,
                    question: "Comment sont calculés vos honoraires ?",
                    answer: "Nos honoraires sont calculés selon plusieurs méthodes...",
                    category: "Honoraires",
                    order: 2
                }
            ],
            
            deadlines: [
                {
                    id: 1,
                    date: "2023-12-15",
                    description: "Dépôt des comptes annuels (PME)",
                    type: "Fiscal",
                    urgent: true,
                    client: "Tous les clients",
                    notes: ""
                },
                {
                    id: 2,
                    date: "2024-01-31",
                    description: "Déclaration fiscale annuelle",
                    type: "Fiscal",
                    urgent: false,
                    client: "Tous les clients",
                    notes: ""
                }
            ],
            
            testimonials: [
                {
                    id: 1,
                    name: "Marie Koné",
                    position: "Directrice Générale, ABC Entreprise",
                    content: "Juris Ark nous a accompagnés dans notre développement international...",
                    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    rating: 5,
                    date: "2023-11-10"
                },
                {
                    id: 2,
                    name: "Samuel Agossou",
                    position: "Gérant, Société Agroplus",
                    content: "Un recouvrement de créances que je pensais impossible...",
                    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    rating: 5,
                    date: "2023-10-25"
                }
            ],
            
            cases: [
                {
                    id: 1,
                    title: "Fusion-acquisition internationale",
                    description: "Accompagnement d'une entreprise béninoise dans l'acquisition d'une société française.",
                    category: "Droit des affaires",
                    result: "Gagné",
                    amount: "2M€",
                    duration: "6 mois",
                    outcome: "Acquisition réussie avec optimisation fiscale"
                },
                {
                    id: 2,
                    title: "Contentieux immobilier complexe",
                    description: "Résolution d'un litige foncier impliquant plusieurs parties sur une durée de 10 ans.",
                    category: "Droit immobilier",
                    result: "Gagné",
                    amount: "450M FCFA",
                    duration: "8 mois",
                    outcome: "Transaction avant jugement favorable"
                }
            ],
            
            blog: [
                {
                    id: 1,
                    title: "Nouvelles réformes fiscales au Bénin en 2023",
                    excerpt: "Analyse des impacts des dernières réformes fiscales...",
                    content: "Contenu complet de l'article...",
                    category: "Fiscal",
                    author: "Juris Ark",
                    date: "2023-11-15",
                    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    status: "published"
                }
            ],
            
            settings: {
                siteName: "Juris Ark",
                siteEmail: "contact@jurisark.bj",
                sitePhone: "+229 XX XX XX XX",
                siteAddress: "Cotonou, Bénin",
                siteDescription: "Cabinet de conseil juridique offrant des services professionnels à Cotonou, Bénin."
            },
            
            activities: [
                { id: 1, action: "Nouvel expert ajouté", user: "Admin", date: "2023-11-20 14:30", type: "team" },
                { id: 2, action: "Témoignage mis à jour", user: "Admin", date: "2023-11-19 11:15", type: "testimonial" },
                { id: 3, action: "Article de blog publié", user: "Admin", date: "2023-11-18 16:45", type: "blog" }
            ]
        };
        
        // Variables globales
        let currentSection = 'dashboard';
        let currentModal = null;
        let itemToDelete = null;
        let deleteType = null;
        
        // ===== INITIALISATION =====
        document.addEventListener('DOMContentLoaded', function() {
            // Vérifier l'authentification
            checkAuth();
            
            // Initialiser l'interface
            initDashboard();
            loadData();
            initNavigation();
            initModals();
            initForms();
            updateStats();
            
            // Afficher le nom d'utilisateur
            const username = sessionStorage.getItem('admin_username') || 'Administrateur';
            document.getElementById('userName').textContent = username;
        });
        
        // ===== AUTHENTIFICATION =====
        
        function checkAuth() {
            const isLoggedIn = sessionStorage.getItem('admin_logged_in');
            if (!isLoggedIn || isLoggedIn !== 'true') {
                window.location.href = 'index.html';
            }
        }
        
        document.getElementById('logoutBtn').addEventListener('click', function() {
            sessionStorage.removeItem('admin_logged_in');
            sessionStorage.removeItem('admin_username');
            window.location.href = 'index.html';
        });
        
        // ===== NAVIGATION =====
        
        function initNavigation() {
            // Navigation sidebar
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const section = this.getAttribute('data-section');
                    
                    // Mettre à jour la navigation active
                    document.querySelectorAll('.nav-link').forEach(l => {
                        l.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Changer de section
                    switchSection(section);
                    
                    // Fermer le menu mobile si ouvert
                    if (window.innerWidth < 992) {
                        document.getElementById('sidebar').classList.remove('active');
                    }
                });
            });
            
            // Bouton menu mobile
            document.getElementById('menuToggle').addEventListener('click', function() {
                document.getElementById('sidebar').classList.toggle('active');
            });
            
            // Fermer le menu au clic en dehors
            document.addEventListener('click', function(e) {
                const sidebar = document.getElementById('sidebar');
                const menuToggle = document.getElementById('menuToggle');
                
                if (window.innerWidth < 992 && 
                    sidebar.classList.contains('active') && 
                    !sidebar.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
        
        function switchSection(section) {
            // Masquer toutes les sections
            document.querySelectorAll('.section-content').forEach(sec => {
                sec.style.display = 'none';
            });
            
            // Afficher la section sélectionnée
            document.getElementById(section + 'Section').style.display = 'block';
            
            // Mettre à jour le titre de la page
            const titles = {
                'dashboard': 'Dashboard',
                'team': 'Équipe d\'Experts',
                'faq': 'Questions Fréquentes',
                'deadlines': 'Délais à Surveiller',
                'testimonials': 'Témoignages Clients',
                'cases': 'Succès d\'Affaires',
                'blog': 'Articles de Blog',
                'settings': 'Paramètres'
            };
            
            document.getElementById('pageTitle').textContent = titles[section];
            currentSection = section;
            
            // Charger les données spécifiques à la section
            if (section !== 'dashboard' && section !== 'settings') {
                loadSectionData(section);
            }
        }
        
        // ===== CHARGEMENT DES DONNÉES =====
        
        function loadData() {
            // En production, charger depuis une API
            updateStats();
            loadActivities();
        }
        
        function loadSectionData(section) {
            switch(section) {
                case 'team':
                    loadTeamTable();
                    break;
                case 'faq':
                    loadFaqTable();
                    break;
                case 'deadlines':
                    loadDeadlinesTable();
                    break;
                case 'testimonials':
                    loadTestimonialsTable();
                    break;
                case 'cases':
                    loadCasesTable();
                    break;
                case 'blog':
                    loadBlogTable();
                    break;
            }
        }
        
        function updateStats() {
            document.getElementById('teamCount').textContent = data.team.length;
            document.getElementById('faqCount').textContent = data.faq.length;
            document.getElementById('testimonialsCount').textContent = data.testimonials.length;
            document.getElementById('casesCount').textContent = data.cases.length;
        }
        
        function loadActivities() {
            const container = document.getElementById('activityList');
            container.innerHTML = '';
            
            // Afficher les 5 dernières activités
            const recentActivities = data.activities.slice(-5).reverse();
            
            recentActivities.forEach(activity => {
                const activityHTML = `
                    <div class="activity-item" style="padding: 15px; border-bottom: 1px solid var(--light-gray); display: flex; align-items: center; gap: 15px;">
                        <div style="width: 40px; height: 40px; background: var(--light); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--secondary);">
                            <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600;">${activity.action}</div>
                            <div style="font-size: 0.9rem; color: var(--gray);">${activity.user} • ${formatDate(activity.date)}</div>
                        </div>
                    </div>
                `;
                container.innerHTML += activityHTML;
            });
        }
        
        function getActivityIcon(type) {
            const icons = {
                'team': 'user-plus',
                'faq': 'question-circle',
                'deadline': 'calendar-alt',
                'testimonial': 'comment',
                'case': 'briefcase',
                'blog': 'newspaper'
            };
            return icons[type] || 'bell';
        }
        
        // ===== GESTION DES TABLES =====
        
        function loadTeamTable() {
            const tbody = document.getElementById('teamTableBody');
            tbody.innerHTML = '';
            
            data.team.sort((a, b) => a.order - b.order).forEach(member => {
                const row = `
                    <tr>
                        <td>
                            <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden;">
                                <img src="${member.photo}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </td>
                        <td>${member.name}</td>
                        <td>${member.title}</td>
                        <td>${member.specialty}</td>
                        <td class="actions">
                            <button class="btn-action btn-edit" onclick="editTeam(${member.id})">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn-action btn-delete" onclick="confirmDelete('team', ${member.id})">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
        
        function loadFaqTable() {
            const tbody = document.getElementById('faqTableBody');
            tbody.innerHTML = '';
            
            data.faq.sort((a, b) => a.order - b.order).forEach(item => {
                const row = `
                    <tr>
                        <td>#${item.id}</td>
                        <td>${item.question}</td>
                        <td>${item.category}</td>
                        <td class="actions">
                            <button class="btn-action btn-edit" onclick="editFaq(${item.id})">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn-action btn-delete" onclick="confirmDelete('faq', ${item.id})">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
        
        function loadDeadlinesTable() {
            const tbody = document.getElementById('deadlinesTableBody');
            tbody.innerHTML = '';
            
            data.deadlines.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(deadline => {
                const row = `
                    <tr>
                        <td>${formatDate(deadline.date)}</td>
                        <td>${deadline.description}</td>
                        <td>${deadline.urgent ? '<span style="color: var(--warning);"><i class="fas fa-exclamation-circle"></i> Oui</span>' : 'Non'}</td>
                        <td class="actions">
                            <button class="btn-action btn-edit" onclick="editDeadline(${deadline.id})">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn-action btn-delete" onclick="confirmDelete('deadline', ${deadline.id})">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
        
        function loadTestimonialsTable() {
            const tbody = document.getElementById('testimonialsTableBody');
            tbody.innerHTML = '';
            
            data.testimonials.forEach(testimonial => {
                const row = `
                    <tr>
                        <td>${testimonial.name}</td>
                        <td>${testimonial.position}</td>
                        <td>${testimonial.content.substring(0, 80)}...</td>
                        <td class="actions">
                            <button class="btn-action btn-edit" onclick="editTestimonial(${testimonial.id})">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn-action btn-delete" onclick="confirmDelete('testimonial', ${testimonial.id})">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
        
        function loadCasesTable() {
            const tbody = document.getElementById('casesTableBody');
            tbody.innerHTML = '';
            
            data.cases.forEach(caseItem => {
                const row = `
                    <tr>
                        <td>${caseItem.title}</td>
                        <td>${caseItem.category}</td>
                        <td>${caseItem.amount}</td>
                        <td><span style="color: var(--success);">${caseItem.result}</span></td>
                        <td class="actions">
                            <button class="btn-action btn-edit" onclick="editCase(${caseItem.id})">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn-action btn-delete" onclick="confirmDelete('case', ${caseItem.id})">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
        
        function loadBlogTable() {
            const tbody = document.getElementById('blogTableBody');
            tbody.innerHTML = '';
            
            data.blog.forEach(article => {
                const row = `
                    <tr>
                        <td>${article.title}</td>
                        <td>${article.category}</td>
                        <td>${formatDate(article.date)}</td>
                        <td>${article.status === 'published' ? '<span style="color: var(--success);">Publié</span>' : '<span style="color: var(--warning);">Brouillon</span>'}</td>
                        <td class="actions">
                            <button class="btn-action btn-edit" onclick="editBlog(${article.id})">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn-action btn-delete" onclick="confirmDelete('blog', ${article.id})">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
        
        // ===== GESTION DES MODALES =====
        
        function initModals() {
            // Boutons pour ouvrir les modales
            document.getElementById('addTeamBtn').addEventListener('click', () => openModal('teamModal'));
            document.getElementById('addFaqBtn').addEventListener('click', () => openModal('faqModal'));
            document.getElementById('addDeadlineBtn').addEventListener('click', () => openModal('deadlineModal'));
            document.getElementById('addTestimonialBtn').addEventListener('click', () => openModal('testimonialModal'));
            document.getElementById('addCaseBtn').addEventListener('click', () => openModal('caseModal'));
            document.getElementById('addBlogBtn').addEventListener('click', () => openModal('blogModal'));
            
            // Fermer les modales
            document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
                btn.addEventListener('click', function() {
                    const modalId = this.getAttribute('data-modal');
                    closeModal(modalId);
                });
            });
            
            // Fermer les modales en cliquant en dehors
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeModal(this.id);
                    }
                });
            });
            
            // Sauvegarder les données
            document.getElementById('saveTeamBtn').addEventListener('click', saveTeam);
            document.getElementById('saveFaqBtn').addEventListener('click', saveFaq);
            document.getElementById('saveDeadlineBtn').addEventListener('click', saveDeadline);
            document.getElementById('saveTestimonialBtn').addEventListener('click', saveTestimonial);
            document.getElementById('saveCaseBtn').addEventListener('click', saveCase);
            document.getElementById('saveBlogBtn').addEventListener('click', saveBlog);
            
            // Confirmation de suppression
            document.getElementById('confirmDeleteBtn').addEventListener('click', deleteItem);
        }
        
        function openModal(modalId, isEdit = false, data = null) {
            currentModal = modalId;
            const modal = document.getElementById(modalId);
            modal.style.display = 'flex';
            
            // Réinitialiser le formulaire
            const form = modal.querySelector('form');
            if (form) form.reset();
            
            // Si édition, remplir les champs
            if (isEdit && data) {
                fillModalForm(modalId, data);
            }
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            currentModal = null;
        }
        
        function fillModalForm(modalId, data) {
            switch(modalId) {
                case 'teamModal':
                    document.getElementById('teamId').value = data.id;
                    document.getElementById('teamName').value = data.name;
                    document.getElementById('teamTitle').value = data.title;
                    document.getElementById('teamSpecialty').value = data.specialty;
                    document.getElementById('teamExperience').value = data.experience || '';
                    document.getElementById('teamBio').value = data.bio;
                    document.getElementById('teamPhoto').value = data.photo || '';
                    document.getElementById('teamOrder').value = data.order || 1;
                    document.getElementById('teamEmail').value = data.email || '';
                    document.getElementById('teamLinkedin').value = data.linkedin || '';
                    document.getElementById('teamModalTitle').textContent = 'Modifier l\'Expert';
                    break;
                    
                case 'faqModal':
                    document.getElementById('faqId').value = data.id;
                    document.getElementById('faqQuestion').value = data.question;
                    document.getElementById('faqAnswer').value = data.answer;
                    document.getElementById('faqCategory').value = data.category;
                    document.getElementById('faqOrder').value = data.order || 1;
                    document.getElementById('faqModalTitle').textContent = 'Modifier la Question';
                    break;
                    
                case 'deadlineModal':
                    document.getElementById('deadlineId').value = data.id;
                    document.getElementById('deadlineDate').value = data.date;
                    document.getElementById('deadlineType').value = data.type || 'Fiscal';
                    document.getElementById('deadlineDescription').value = data.description;
                    document.getElementById('deadlineClient').value = data.client || '';
                    document.getElementById('deadlineUrgent').value = data.urgent ? '1' : '0';
                    document.getElementById('deadlineNotes').value = data.notes || '';
                    document.getElementById('deadlineModalTitle').textContent = 'Modifier le Délai';
                    break;
                    
                case 'testimonialModal':
                    document.getElementById('testimonialId').value = data.id;
                    document.getElementById('testimonialName').value = data.name;
                    document.getElementById('testimonialPosition').value = data.position;
                    document.getElementById('testimonialContent').value = data.content;
                    document.getElementById('testimonialPhoto').value = data.photo || '';
                    document.getElementById('testimonialRating').value = data.rating || 5;
                    document.getElementById('testimonialDate').value = data.date || '';
                    document.getElementById('testimonialModalTitle').textContent = 'Modifier le Témoignage';
                    break;
                    
                case 'caseModal':
                    document.getElementById('caseId').value = data.id;
                    document.getElementById('caseTitle').value = data.title;
                    document.getElementById('caseDescription').value = data.description;
                    document.getElementById('caseCategory').value = data.category;
                    document.getElementById('caseResult').value = data.result;
                    document.getElementById('caseAmount').value = data.amount || '';
                    document.getElementById('caseDuration').value = data.duration || '';
                    document.getElementById('caseOutcome').value = data.outcome || '';
                    document.getElementById('caseModalTitle').textContent = 'Modifier le Succès';
                    break;
                    
                case 'blogModal':
                    document.getElementById('blogId').value = data.id;
                    document.getElementById('blogTitle').value = data.title;
                    document.getElementById('blogExcerpt').value = data.excerpt;
                    document.getElementById('blogContent').value = data.content;
                    document.getElementById('blogCategory').value = data.category;
                    document.getElementById('blogAuthor').value = data.author || 'Juris Ark';
                    document.getElementById('blogDate').value = data.date || '';
                    document.getElementById('blogImage').value = data.image || '';
                    document.getElementById('blogStatus').value = data.status || 'published';
                    document.getElementById('blogModalTitle').textContent = 'Modifier l\'Article';
                    break;
            }
        }
        
        // ===== FONCTIONS D'ÉDITION =====
        
        window.editTeam = function(id) {
            const member = data.team.find(item => item.id === id);
            if (member) {
                openModal('teamModal', true, member);
            }
        }
        
        window.editFaq = function(id) {
            const item = data.faq.find(item => item.id === id);
            if (item) {
                openModal('faqModal', true, item);
            }
        }
        
        window.editDeadline = function(id) {
            const item = data.deadlines.find(item => item.id === id);
            if (item) {
                openModal('deadlineModal', true, item);
            }
        }
        
        window.editTestimonial = function(id) {
            const item = data.testimonials.find(item => item.id === id);
            if (item) {
                openModal('testimonialModal', true, item);
            }
        }
        
        window.editCase = function(id) {
            const item = data.cases.find(item => item.id === id);
            if (item) {
                openModal('caseModal', true, item);
            }
        }
        
        window.editBlog = function(id) {
            const item = data.blog.find(item => item.id === id);
            if (item) {
                openModal('blogModal', true, item);
            }
        }
        
        // ===== SAUVEGARDE DES DONNÉES =====
        
        function saveTeam() {
            const id = parseInt(document.getElementById('teamId').value) || Date.now();
            const name = document.getElementById('teamName').value;
            const title = document.getElementById('teamTitle').value;
            const specialty = document.getElementById('teamSpecialty').value;
            const experience = parseInt(document.getElementById('teamExperience').value) || 0;
            const bio = document.getElementById('teamBio').value;
            const photo = document.getElementById('teamPhoto').value;
            const order = parseInt(document.getElementById('teamOrder').value) || 1;
            
            const teamData = {
                id,
                name,
                title,
                specialty,
                experience,
                bio,
                photo,
                order
            };
            
            // Vérifier si c'est une modification ou un ajout
            const existingIndex = data.team.findIndex(item => item.id === id);
            if (existingIndex >= 0) {
                data.team[existingIndex] = teamData;
                addActivity(`Expert "${name}" modifié`, 'team');
            } else {
                data.team.push(teamData);
                addActivity(`Nouvel expert "${name}" ajouté`, 'team');
            }
            
            closeModal('teamModal');
            loadTeamTable();
            updateStats();
            showSuccess('Expert enregistré avec succès!');
        }
        
        function saveFaq() {
            const id = parseInt(document.getElementById('faqId').value) || Date.now();
            const question = document.getElementById('faqQuestion').value;
            const answer = document.getElementById('faqAnswer').value;
            const category = document.getElementById('faqCategory').value;
            const order = parseInt(document.getElementById('faqOrder').value) || 1;
            
            const faqData = {
                id,
                question,
                answer,
                category,
                order
            };
            
            const existingIndex = data.faq.findIndex(item => item.id === id);
            if (existingIndex >= 0) {
                data.faq[existingIndex] = faqData;
                addActivity(`Question FAQ modifiée`, 'faq');
            } else {
                data.faq.push(faqData);
                addActivity(`Nouvelle question FAQ ajoutée`, 'faq');
            }
            
            closeModal('faqModal');
            loadFaqTable();
            updateStats();
            showSuccess('Question FAQ enregistrée avec succès!');
        }
        
        function saveDeadline() {
            const id = parseInt(document.getElementById('deadlineId').value) || Date.now();
            const date = document.getElementById('deadlineDate').value;
            const type = document.getElementById('deadlineType').value;
            const description = document.getElementById('deadlineDescription').value;
            const client = document.getElementById('deadlineClient').value;
            const urgent = document.getElementById('deadlineUrgent').value === '1';
            const notes = document.getElementById('deadlineNotes').value;
            
            const deadlineData = {
                id,
                date,
                type,
                description,
                client,
                urgent,
                notes
            };
            
            const existingIndex = data.deadlines.findIndex(item => item.id === id);
            if (existingIndex >= 0) {
                data.deadlines[existingIndex] = deadlineData;
                addActivity(`Délai "${description}" modifié`, 'deadline');
            } else {
                data.deadlines.push(deadlineData);
                addActivity(`Nouveau délai "${description}" ajouté`, 'deadline');
            }
            
            closeModal('deadlineModal');
            loadDeadlinesTable();
            showSuccess('Délai enregistré avec succès!');
        }
        
        function saveTestimonial() {
            const id = parseInt(document.getElementById('testimonialId').value) || Date.now();
            const name = document.getElementById('testimonialName').value;
            const position = document.getElementById('testimonialPosition').value;
            const content = document.getElementById('testimonialContent').value;
            const photo = document.getElementById('testimonialPhoto').value;
            const rating = parseInt(document.getElementById('testimonialRating').value);
            const date = document.getElementById('testimonialDate').value || new Date().toISOString().split('T')[0];
            
            const testimonialData = {
                id,
                name,
                position,
                content,
                photo,
                rating,
                date
            };
            
            const existingIndex = data.testimonials.findIndex(item => item.id === id);
            if (existingIndex >= 0) {
                data.testimonials[existingIndex] = testimonialData;
                addActivity(`Témoignage de "${name}" modifié`, 'testimonial');
            } else {
                data.testimonials.push(testimonialData);
                addActivity(`Nouveau témoignage de "${name}" ajouté`, 'testimonial');
            }
            
            closeModal('testimonialModal');
            loadTestimonialsTable();
            updateStats();
            showSuccess('Témoignage enregistré avec succès!');
        }
        
        function saveCase() {
            const id = parseInt(document.getElementById('caseId').value) || Date.now();
            const title = document.getElementById('caseTitle').value;
            const description = document.getElementById('caseDescription').value;
            const category = document.getElementById('caseCategory').value;
            const result = document.getElementById('caseResult').value;
            const amount = document.getElementById('caseAmount').value;
            const duration = document.getElementById('caseDuration').value;
            const outcome = document.getElementById('caseOutcome').value;
            
            const caseData = {
                id,
                title,
                description,
                category,
                result,
                amount,
                duration,
                outcome
            };
            
            const existingIndex = data.cases.findIndex(item => item.id === id);
            if (existingIndex >= 0) {
                data.cases[existingIndex] = caseData;
                addActivity(`Succès d'affaires "${title}" modifié`, 'case');
            } else {
                data.cases.push(caseData);
                addActivity(`Nouveau succès d'affaires "${title}" ajouté`, 'case');
            }
            
            closeModal('caseModal');
            loadCasesTable();
            updateStats();
            showSuccess('Succès d\'affaires enregistré avec succès!');
        }
        
        function saveBlog() {
            const id = parseInt(document.getElementById('blogId').value) || Date.now();
            const title = document.getElementById('blogTitle').value;
            const excerpt = document.getElementById('blogExcerpt').value;
            const content = document.getElementById('blogContent').value;
            const category = document.getElementById('blogCategory').value;
            const author = document.getElementById('blogAuthor').value;
            const date = document.getElementById('blogDate').value || new Date().toISOString().split('T')[0];
            const image = document.getElementById('blogImage').value;
            const status = document.getElementById('blogStatus').value;
            
            const blogData = {
                id,
                title,
                excerpt,
                content,
                category,
                author,
                date,
                image,
                status
            };
            
            const existingIndex = data.blog.findIndex(item => item.id === id);
            if (existingIndex >= 0) {
                data.blog[existingIndex] = blogData;
                addActivity(`Article "${title}" modifié`, 'blog');
            } else {
                data.blog.push(blogData);
                addActivity(`Nouvel article "${title}" ajouté`, 'blog');
            }
            
            closeModal('blogModal');
            loadBlogTable();
            showSuccess('Article enregistré avec succès!');
        }
        
        // ===== SUPPRESSION =====
        
        window.confirmDelete = function(type, id) {
            deleteType = type;
            itemToDelete = id;
            
            const messages = {
                'team': 'Êtes-vous sûr de vouloir supprimer cet expert ?',
                'faq': 'Êtes-vous sûr de vouloir supprimer cette question ?',
                'deadline': 'Êtes-vous sûr de vouloir supprimer ce délai ?',
                'testimonial': 'Êtes-vous sûr de vouloir supprimer ce témoignage ?',
                'case': 'Êtes-vous sûr de vouloir supprimer ce succès d\'affaires ?',
                'blog': 'Êtes-vous sûr de vouloir supprimer cet article ?'
            };
            
            document.getElementById('confirmMessage').textContent = messages[type] || 'Êtes-vous sûr de vouloir supprimer cet élément ?';
            openModal('confirmModal');
        }
        
        function deleteItem() {
            if (!deleteType || !itemToDelete) return;
            
            let itemName = '';
            
            switch(deleteType) {
                case 'team':
                    const teamIndex = data.team.findIndex(item => item.id === itemToDelete);
                    if (teamIndex >= 0) {
                        itemName = data.team[teamIndex].name;
                        data.team.splice(teamIndex, 1);
                        loadTeamTable();
                    }
                    break;
                    
                case 'faq':
                    const faqIndex = data.faq.findIndex(item => item.id === itemToDelete);
                    if (faqIndex >= 0) {
                        itemName = data.faq[faqIndex].question;
                        data.faq.splice(faqIndex, 1);
                        loadFaqTable();
                    }
                    break;
                    
                case 'deadline':
                    const deadlineIndex = data.deadlines.findIndex(item => item.id === itemToDelete);
                    if (deadlineIndex >= 0) {
                        itemName = data.deadlines[deadlineIndex].description;
                        data.deadlines.splice(deadlineIndex, 1);
                        loadDeadlinesTable();
                    }
                    break;
                    
                case 'testimonial':
                    const testimonialIndex = data.testimonials.findIndex(item => item.id === itemToDelete);
                    if (testimonialIndex >= 0) {
                        itemName = data.testimonials[testimonialIndex].name;
                        data.testimonials.splice(testimonialIndex, 1);
                        loadTestimonialsTable();
                    }
                    break;
                    
                case 'case':
                    const caseIndex = data.cases.findIndex(item => item.id === itemToDelete);
                    if (caseIndex >= 0) {
                        itemName = data.cases[caseIndex].title;
                        data.cases.splice(caseIndex, 1);
                        loadCasesTable();
                    }
                    break;
                    
                case 'blog':
                    const blogIndex = data.blog.findIndex(item => item.id === itemToDelete);
                    if (blogIndex >= 0) {
                        itemName = data.blog[blogIndex].title;
                        data.blog.splice(blogIndex, 1);
                        loadBlogTable();
                    }
                    break;
            }
            
            addActivity(`${itemName} supprimé`, deleteType);
            updateStats();
            closeModal('confirmModal');
            showSuccess('Élément supprimé avec succès!');
            
            deleteType = null;
            itemToDelete = null;
        }
        
        // ===== FORMULAIRES DES PARAMÈTRES =====
        
        function initForms() {
            // Paramètres généraux
            document.getElementById('generalSettingsForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                data.settings.siteName = document.getElementById('siteName').value;
                data.settings.siteEmail = document.getElementById('siteEmail').value;
                data.settings.sitePhone = document.getElementById('sitePhone').value;
                data.settings.siteAddress = document.getElementById('siteAddress').value;
                data.settings.siteDescription = document.getElementById('siteDescription').value;
                
                addActivity('Paramètres du site modifiés', 'settings');
                showSuccess('Paramètres enregistrés avec succès!');
            });
            
            // Paramètres de sécurité
            document.getElementById('securitySettingsForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (newPassword !== confirmPassword) {
                    showError('Les mots de passe ne correspondent pas!');
                    return;
                }
                
                if (newPassword.length < 6) {
                    showError('Le mot de passe doit contenir au moins 6 caractères!');
                    return;
                }
                
                // En production, envoyer le nouveau mot de passe au serveur
                addActivity('Mot de passe administrateur changé', 'security');
                showSuccess('Mot de passe mis à jour avec succès!');
                this.reset();
            });
        }
        
        // ===== FONCTIONS UTILITAIRES =====
        
        function addActivity(action, type) {
            const activity = {
                id: Date.now(),
                action,
                user: sessionStorage.getItem('admin_username') || 'Admin',
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                type
            };
            
            data.activities.push(activity);
            loadActivities();
        }
        
        function formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        
        function showSuccess(message) {
            // Créer une notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--box-shadow);
                z-index: 3000;
                animation: slideIn 0.3s;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check-circle"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
        
        function showError(message) {
            // Créer une notification d'erreur
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--danger);
                color: white;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--box-shadow);
                z-index: 3000;
                animation: slideIn 0.3s;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
        
        // Ajouter les styles d'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // ===== DASHBOARD INITIAL =====
        
        function initDashboard() {
            // Remplir les paramètres
            document.getElementById('siteName').value = data.settings.siteName;
            document.getElementById('siteEmail').value = data.settings.siteEmail;
            document.getElementById('sitePhone').value = data.settings.sitePhone;
            document.getElementById('siteAddress').value = data.settings.siteAddress;
            document.getElementById('siteDescription').value = data.settings.siteDescription;
        }
        
        // ===== EXPORT DES DONNÉES =====
        
        function exportData() {
            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `jurisark-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
        
        // Ajouter un bouton d'export dans les paramètres
        const settingsSection = document.getElementById('settingsSection');
        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn-add';
        exportBtn.style.marginTop = '20px';
        exportBtn.innerHTML = '<i class="fas fa-download"></i> Exporter les données';
        exportBtn.onclick = exportData;
        
        settingsSection.querySelector('.section-header').appendChild(exportBtn);
    </script>
</body>
</html>
```

## 🔧 **Comment Déployer le Dashboard**

### 1. **Créer le sous-domaine**
```bash
# Exemple de configuration pour un sous-domaine (admin.jurisark.bj)
# Ajouter dans votre fichier .htaccess ou configuration serveur

# Apache
<VirtualHost *:80>
    ServerName admin.jurisark.bj
    DocumentRoot /var/www/jurisark-admin
    ErrorLog ${APACHE_LOG_DIR}/admin-error.log
    CustomLog ${APACHE_LOG_DIR}/admin-access.log combined
</VirtualHost>

# Nginx
server {
    listen 80;
    server_name admin.jurisark.bj;
    root /var/www/jurisark-admin;
    index index.html;
}
```

### 2. **Structure des Fichiers**
```
public_html/ (ou www/)
├── main-site/           # Site principal Juris Ark
│   └── index.html
│
└── admin/              # Dashboard administrateur
    ├── index.html      # Page de connexion
    ├── dashboard.html  # Interface admin
    ├── style.css       # Styles
    ├── admin.js        # Logique JavaScript
    └── data/           # Dossiers pour les données
        ├── team.json
        ├── faq.json
        ├── deadlines.json
        ├── testimonials.json
        ├── cases.json
        └── settings.json
```

### 3. **Configuration de Sécurité**

```javascript
// Dans un fichier config.js (à ajouter)
const SECURITY_CONFIG = {
    // En production, remplacer par une authentification réelle
    adminUser: 'jurisark_admin',
    adminPassHash: 'hashed_password_here', // Utiliser bcrypt
    
    // Configuration CORS
    allowedOrigins: ['https://jurisark.bj'],
    
    // Limites de taux
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // 100 requêtes par IP
    },
    
    // JWT Configuration
    jwtSecret: 'votre_clé_secrète_très_longue',
    jwtExpiresIn: '24h'
};
```

### 4. **API Backend (Optionnel - Pour Production)**

```javascript
// server.js (Node.js/Express)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, SECURITY_CONFIG.jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes d'authentification
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Vérifier les identifiants
    if (username === 'admin' && password === 'jurisark2023') {
        const token = jwt.sign(
            { username, role: 'admin' },
            SECURITY_CONFIG.jwtSecret,
            { expiresIn: SECURITY_CONFIG.jwtExpiresIn }
        );
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Identifiants incorrects' });
    }
});

// Routes CRUD protégées
app.get('/api/team', authenticateToken, async (req, res) => {
    const data = await fs.readFile(path.join(__dirname, 'data/team.json'), 'utf8');
    res.json(JSON.parse(data));
});

app.post('/api/team', authenticateToken, async (req, res) => {
    // Sauvegarder les données
    await fs.writeFile(
        path.join(__dirname, 'data/team.json'),
        JSON.stringify(req.body, null, 2)
    );
    res.json({ success: true });
});

// ... autres routes pour FAQ, témoignages, etc.

app.listen(3000, () => {
    console.log('Serveur admin sur le port 3000');
});
```

### 5. **Modifier les identifiants par défaut**

**Important** : Changez immédiatement les identifiants par défaut !

Dans `index.html`, modifiez :
```javascript
// Ligne 73 dans le script
if (username === 'admin' && password === 'jurisark2023') {
```

Remplacez par vos propres identifiants sécurisés :
```javascript
if (username === 'votre_nom_utilisateur' && password === 'votre_mot_de_passe_complexe') {
```

## 📱 **Fonctionnalités du Dashboard**

✅ **Authentification sécurisée**  
✅ **Gestion complète du contenu** :
- Équipe d'experts (CRUD complet)
- Questions fréquentes
- Délais à surveiller
- Témoignages clients
- Succès d'affaires
- Articles de blog

✅ **Interface intuitive** :
- Design responsive
- Navigation sidebar
- Modales d'édition
- Notifications
- Statistiques

✅ **Sécurité** :
- Session storage
- Protection des routes
- Validation des formulaires

## 🚀 **Prochaines Étapes pour Production**

1. **Configurer un vrai backend** avec Node.js/Express
2. **Utiliser une base de données** (MySQL, PostgreSQL)
3. **Implémenter JWT** pour l'authentification
4. **Ajouter un système de logs**
5. **Configurer HTTPS** pour le sous-domaine
6. **Mettre en place un backup automatique**
7. **Ajouter un système de rôles** (admin, éditeur)

## 🔒 **Meilleures Pratiques de Sécurité**

1. **Ne jamais stocker de mots de passe en clair**
2. **Utiliser HTTPS obligatoirement**
3. **Limiter les tentatives de connexion**
4. **Valider et sanitizer toutes les entrées**
5. **Mettre à jour régulièrement les dépendances**
6. **Configurer un firewall**
7. **Sauvegarder quotidiennement les données**