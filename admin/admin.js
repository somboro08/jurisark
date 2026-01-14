let data = {};
let currentModal = null;
let itemToDelete = null;
let deleteType = null;
let currentSection = 'dashboard';
let rowToRemoveElement = null;

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function loadAllData() {
    try {
        console.log('Chargement des données depuis Supabase...');
        
        const teamResult = await supabaseClient.from('team_members').select('*');
        const faqResult = await supabaseClient.from('faq_items').select('*');
        const deadlinesResult = await supabaseClient.from('deadlines').select('*');
        const testimonialsResult = await supabaseClient.from('testimonials').select('*');
        const casesResult = await supabaseClient.from('case_studies').select('*');
        const blogResult = await supabaseClient.from('blog_posts').select('*');
        const settingsResult = await supabaseClient.from('site_settings').select('*');
        const activitiesResult = await supabaseClient.from('activities').select('*');
        const appointmentsResult = await supabaseClient.from('appointments').select('*');
        const formationsResult = await supabaseClient.from('formations').select('*');
        const formationRegistrationsResult = await supabaseClient.from('formation_registrations').select('*');

        const errors = [];
        if (teamResult.error) { console.error("Erreur team_members:", teamResult.error.message); errors.push('team'); }
        if (faqResult.error) { console.error("Erreur faq_items:", faqResult.error.message); errors.push('faq'); }
        if (deadlinesResult.error) { console.error("Erreur deadlines:", deadlinesResult.error.message); errors.push('deadlines'); }
        if (testimonialsResult.error) { console.error("Erreur testimonials:", testimonialsResult.error.message); errors.push('testimonials'); }
        if (casesResult.error) { console.error("Erreur case_studies:", casesResult.error.message); errors.push('cases'); }
        if (blogResult.error) { console.error("Erreur blog_posts:", blogResult.error.message); errors.push('blog'); }
        if (settingsResult.error) { console.error("Erreur site_settings:", settingsResult.error.message); errors.push('settings'); }
        if (activitiesResult.error) { console.error("Erreur activities:", activitiesResult.error.message); errors.push('activities'); }
        if (appointmentsResult.error) { console.error("Erreur appointments:", appointmentsResult.error.message); errors.push('appointments'); }
        if (formationsResult.error) { console.error("Erreur formations:", formationsResult.error.message); errors.push('formations'); }
        if (formationRegistrationsResult.error) { console.error("Erreur formation_registrations:", formationRegistrationsResult.error.message); errors.push('formation_registrations'); }

        data = {
            team: teamResult.data || [],
            faq: faqResult.data || [],
            deadlines: deadlinesResult.data || [],
            testimonials: testimonialsResult.data || [],
            cases: casesResult.data || [],
            blog: blogResult.data || [],
            settings: settingsResult.data && settingsResult.data.length > 0 ? settingsResult.data[0] : {},
            activities: activitiesResult.data || [],
            appointments: appointmentsResult.data || [],
            formations: formationsResult.data || [],
            formation_registrations: formationRegistrationsResult.data || [],
        };
        
        console.log('Données chargées:', {
            team: data.team.length,
            faq: data.faq.length,
            deadlines: data.deadlines.length,
            testimonials: data.testimonials.length,
            cases: data.cases.length,
            blog: data.blog.length,
            appointments: data.appointments.length,
            formations: data.formations.length,
            registrations: data.formation_registrations.length
        });

        updateStats();
        loadActivities();
        
        if (currentSection !== 'dashboard' && currentSection !== 'settings') {
            loadSectionData(currentSection);
        }
        
        if (errors.length > 0) {
            showWarning(`Certaines tables n'ont pas pu être chargées: ${errors.join(', ')}`);
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showError('Erreur de connexion à la base de données');
    }
}

window.dashboard = {
    loadAllData,
    editTeam,
    confirmDelete,
    deleteItem,
    editFaq,
    editDeadline,
    editTestimonial,
    editCase,
    editBlog,
    editFormation,
    confirmFormationRegistration,
    confirmAppointment
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation...');
    checkAuth();
    initModals();
    initNavigation();
    
    // Charger les données après vérification d'auth
    setTimeout(() => window.dashboard.loadAllData(), 100);
});

function initModals() {
    console.log('Initialisation des modals...');
    
    // Boutons "Ajouter"
    document.getElementById('addTeamBtn')?.addEventListener('click', () => openModal('team'));
    document.getElementById('addFaqBtn')?.addEventListener('click', () => openModal('faq'));
    document.getElementById('addDeadlineBtn')?.addEventListener('click', () => openModal('deadline'));
    document.getElementById('addTestimonialBtn')?.addEventListener('click', () => openModal('testimonial'));
    document.getElementById('addCaseBtn')?.addEventListener('click', () => openModal('case'));
    document.getElementById('addBlogBtn')?.addEventListener('click', () => openModal('blog'));
    document.getElementById('addFormationBtn')?.addEventListener('click', () => openModal('formation'));

    // Fermer les modals
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(button => {
        const modalId = button.getAttribute('data-modal') || button.closest('.modal')?.id;
        if (modalId) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(modalId);
            });
        }
    });

    // Fermer modal en cliquant à l'extérieur
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Boutons "Enregistrer"
    document.getElementById('saveTeamBtn')?.addEventListener('click', saveTeam);
    document.getElementById('saveFaqBtn')?.addEventListener('click', saveFaq);
    document.getElementById('saveDeadlineBtn')?.addEventListener('click', saveDeadline);
    document.getElementById('saveTestimonialBtn')?.addEventListener('click', saveTestimonial);
    document.getElementById('saveCaseBtn')?.addEventListener('click', saveCase);
    document.getElementById('saveBlogBtn')?.addEventListener('click', saveBlog);
    document.getElementById('saveFormationBtn')?.addEventListener('click', saveFormation);
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', deleteItem);

    // Forms settings
    document.getElementById('generalSettingsForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveGeneralSettings();
    });

    document.getElementById('securitySettingsForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveSecuritySettings();
    });
    
    console.log('Modals initialisés');
}

function openModal(type, id = null) {
    console.log(`Ouverture modal ${type}, ID: ${id}`);
    const modalId = type + 'Modal';
    const modal = document.getElementById(modalId);
    
    if (!modal) {
        console.error(`Modal ${modalId} non trouvé`);
        showError(`Modal ${type} non disponible`);
        return;
    }
    
    currentModal = modal;
    modal.style.display = 'block';
    
    // Réinitialiser le formulaire
    const form = document.getElementById(type + 'Form');
    if (form) {
        form.reset();
        
        // Réinitialiser l'ID caché
        const idInput = document.getElementById(type + 'Id');
        if (idInput) {
            idInput.value = id || '';
        }
        
        // Si c'est une édition, charger les données
        if (id) {
            setTimeout(() => loadFormData(type, id), 50);
        }
    }
    
    // Mettre à jour le titre
    const titleEl = document.getElementById(type + 'ModalTitle');
    if(titleEl) {
        titleEl.textContent = id ? 
            `Modifier ${getTypeName(type)}` : 
            `Ajouter ${getTypeName(type)}`;
    }
}

function getTypeName(type) {
    const names = {
        'team': 'Membre d\'équipe',
        'faq': 'Question FAQ',
        'deadline': 'Délai',
        'testimonial': 'Témoignage',
        'case': 'Succès d\'affaires',
        'blog': 'Article de blog',
        'formation': 'Formation'
    };
    return names[type] || type;
}

function loadFormData(type, id) {
    console.log(`Chargement données pour ${type} ID: ${id}`);
    
    if (!data || !data[type]) {
        console.error(`Données non disponibles pour ${type}`);
        return;
    }
    
    const item = data[type].find(item => item.id == id);
    if (!item) {
        console.error(`${type} avec ID ${id} non trouvé`);
        showError(`Élément non trouvé`);
        return;
    }
    
    console.log(`Données trouvées:`, item);
    
    switch(type) {
        case 'team':
            document.getElementById('teamId').value = item.id;
            document.getElementById('teamName').value = item.name || '';
            document.getElementById('teamTitle').value = item.title || '';
            document.getElementById('teamSpecialty').value = item.specialty || '';
            document.getElementById('teamExperience').value = item.experience || '';
            document.getElementById('teamBio').value = item.bio || '';
            document.getElementById('teamPhoto').value = item.photo_url || '';
            document.getElementById('teamOrder').value = item.order || '';
            document.getElementById('teamEmail').value = item.email || '';
            document.getElementById('teamLinkedin').value = item.linkedin_url || '';
            break;
            
        case 'faq':
            document.getElementById('faqId').value = item.id;
            document.getElementById('faqQuestion').value = item.question || '';
            document.getElementById('faqAnswer').value = item.answer || '';
            document.getElementById('faqCategory').value = item.category || '';
            document.getElementById('faqOrder').value = item.order || '';
            break;
            
        case 'deadline':
            document.getElementById('deadlineId').value = item.id;
            document.getElementById('deadlineDate').value = item.date ? item.date.split('T')[0] : '';
            document.getElementById('deadlineDescription').value = item.description || '';
            document.getElementById('deadlineType').value = item.type || '';
            document.getElementById('deadlineClient').value = item.client || '';
            document.getElementById('deadlineUrgent').value = item.urgent ? '1' : '0';
            document.getElementById('deadlineNotes').value = item.notes || '';
            break;
            
        case 'testimonial':
            document.getElementById('testimonialId').value = item.id;
            document.getElementById('testimonialName').value = item.author_name || '';
            document.getElementById('testimonialPosition').value = item.author_position || '';
            document.getElementById('testimonialContent').value = item.content || '';
            document.getElementById('testimonialPhoto').value = item.author_photo_url || '';
            document.getElementById('testimonialRating').value = item.rating || '';
            document.getElementById('testimonialDate').value = item.date ? item.date.split('T')[0] : '';
            break;
            
        case 'case':
            document.getElementById('caseId').value = item.id;
            document.getElementById('caseTitle').value = item.title || '';
            document.getElementById('caseDescription').value = item.description || '';
            document.getElementById('caseCategory').value = item.category || '';
            document.getElementById('caseResult').value = item.result || '';
            document.getElementById('caseAmount').value = item.amount || '';
            document.getElementById('caseDuration').value = item.duration || '';
            document.getElementById('caseOutcome').value = item.outcome || '';
            break;
            
        case 'blog':
            document.getElementById('blogId').value = item.id;
            document.getElementById('blogTitle').value = item.title || '';
            document.getElementById('blogExcerpt').value = item.excerpt || '';
            document.getElementById('blogContent').value = item.content || '';
            document.getElementById('blogCategory').value = item.category || '';
            document.getElementById('blogAuthor').value = item.author || '';
            document.getElementById('blogDate').value = item.created_at ? item.created_at.split('T')[0] : '';
            document.getElementById('blogImage').value = item.image_url || '';
            document.getElementById('blogStatus').value = item.status || '';
            break;
            
        case 'formation':
            document.getElementById('formationId').value = item.id;
            document.getElementById('formationTitle').value = item.title || '';
            document.getElementById('formationDescription').value = item.description || '';
            document.getElementById('formationIcon').value = item.icon || '';
            break;
    }
}

function closeModal(modalId) {
    if (!modalId) return;
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        currentModal = null;
    }
    
    if (modalId === 'confirm') {
        itemToDelete = null;
        deleteType = null;
        rowToRemoveElement = null;
    }
}

// ===== AUTHENTIFICATION =====

async function checkAuth() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error || !session) {
            console.warn('Non authentifié, redirection vers index.html');
            window.location.href = 'index.html';
            return;
        }
        
        console.log('Utilisateur authentifié:', session.user.email);
        document.getElementById('userName').textContent = session.user.email || 'Administrateur';
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        window.location.href = 'index.html';
    }
}

document.getElementById('logoutBtn')?.addEventListener('click', async function() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        
        console.log('Déconnexion réussie');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
        showError('Erreur lors de la déconnexion');
    }
});

// ===== NAVIGATION =====

function initNavigation() {
    // Navigation sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            if (!section) return;
            
            // Mettre à jour la navigation active
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
            });
            this.classList.add('active');
            
            // Changer de section
            switchSection(section);
            
            // Fermer le menu mobile
            if (window.innerWidth < 992) {
                document.getElementById('sidebar')?.classList.remove('active');
            }
        });
    });
    
    // Bouton menu mobile
    document.getElementById('menuToggle')?.addEventListener('click', function() {
        document.getElementById('sidebar')?.classList.toggle('active');
    });
    
    // Fermer le menu au clic en dehors
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (window.innerWidth < 992 && 
            sidebar?.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !menuToggle?.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Section par défaut
    switchSection('dashboard');
}

function switchSection(section) {
    console.log(`Changement vers section: ${section}`);
    currentSection = section;
    
    // Masquer toutes les sections
    document.querySelectorAll('.section-content').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // Afficher la section sélectionnée
    const sectionElement = document.getElementById(section + 'Section');
    if (sectionElement) {
        sectionElement.style.display = 'block';
        
        // Mettre à jour le titre
        const titles = {
            'dashboard': 'Dashboard',
            'team': 'Équipe d\'Experts',
            'faq': 'Questions Fréquentes',
            'deadlines': 'Délais à Surveiller',
            'testimonials': 'Témoignages Clients',
            'cases': 'Succès d\'Affaires',
            'blog': 'Articles de Blog',
            'formations': 'Gestion des Formations',
            'formation_registrations': 'Inscriptions aux Formations',
            'appointments': 'Gestion des Rendez-vous',
            'settings': 'Paramètres'
        };
        
        document.getElementById('pageTitle').textContent = titles[section] || section;
        
        // Charger les données spécifiques
        if (section !== 'dashboard' && section !== 'settings') {
            loadSectionData(section);
        }
    }
}

// ===== CHARGEMENT DES DONNÉES =====

function loadSectionData(section) {
    console.log(`Chargement données section: ${section}`);
    
    if (!data) {
        console.warn('Données non disponibles');
        return;
    }
    
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
        case 'formations':
            loadFormationsTable();
            break;
        case 'formation_registrations':
            loadFormationRegistrationsTable();
            break;
        case 'appointments':
            loadAppointmentsTable();
            break;
    }
}

function updateStats() {
    if (!data) return;
    
    const teamCount = data.team?.length || 0;
    const faqCount = data.faq?.length || 0;
    const testimonialsCount = data.testimonials?.length || 0;
    const casesCount = data.cases?.length || 0;
    const appointmentsCount = data.appointments?.length || 0;
    
    console.log(`Statistiques: Équipe=${teamCount}, FAQ=${faqCount}, Témoignages=${testimonialsCount}, Cas=${casesCount}, RDV=${appointmentsCount}`);
    
    document.getElementById('teamCount')?.textContent = teamCount;
    document.getElementById('faqCount')?.textContent = faqCount;
    document.getElementById('testimonialsCount')?.textContent = testimonialsCount;
    document.getElementById('casesCount')?.textContent = casesCount;
    document.getElementById('appointmentsCount')?.textContent = appointmentsCount;
}

function loadActivities() {
    const container = document.getElementById('activityList');
    if (!container || !data?.activities) return;
    
    container.innerHTML = '';
    
    if (data.activities.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--gray);">Aucune activité récente</div>';
        return;
    }
    
    const recentActivities = data.activities.slice(-5).reverse();
    
    recentActivities.forEach(activity => {
        const activityHTML = `
            <div class="activity-item" style="padding: 15px; border-bottom: 1px solid var(--light-gray); display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; background: var(--light); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--secondary);">
                    <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${activity.action}</div>
                    <div style="font-size: 0.9rem; color: var(--gray);">${formatDate(activity.created_at)}</div>
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

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

// ===== GESTION DES TABLES =====

function loadTeamTable() {
    const tbody = document.getElementById('teamTableBody');
    if (!tbody || !data?.team) return;
    
    tbody.innerHTML = '';
    
    if (data.team.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Aucun membre d\'équipe</td></tr>';
        return;
    }
    
    data.team.sort((a, b) => (a.order || 0) - (b.order || 0)).forEach(member => {
        const row = `
            <tr>
                <td>
                    <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden;">
                        <img src="${escapeHtml(member.photo_url || '')}" alt="${escapeHtml(member.name)}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </td>
                <td>${escapeHtml(member.name)}</td>
                <td>${escapeHtml(member.title)}</td>
                <td>${escapeHtml(member.specialty)}</td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="dashboard.editTeam(${member.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('team', ${member.id}, this)">
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
    if (!tbody || !data?.faq) return;
    
    tbody.innerHTML = '';
    
    if (data.faq.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Aucune question FAQ</td></tr>';
        return;
    }
    
    data.faq.sort((a, b) => (a.order || 0) - (b.order || 0)).forEach(item => {
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.question)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="dashboard.editFaq(${item.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('faq', ${item.id}, this)">
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
    if (!tbody || !data?.deadlines) return;
    
    tbody.innerHTML = '';
    
    if (data.deadlines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Aucun délai</td></tr>';
        return;
    }
    
    data.deadlines.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(deadline => {
        const row = `
            <tr>
                <td>${formatDate(deadline.date)}</td>
                <td>${escapeHtml(deadline.description)}</td>
                <td>${deadline.urgent ? '<span style="color: var(--warning);"><i class="fas fa-exclamation-circle"></i> Oui</span>' : 'Non'}</td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="dashboard.editDeadline(Number(${deadline.id}))">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('deadline', Number(${deadline.id}), this)">
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
    if (!tbody || !data?.testimonials) return;
    
    tbody.innerHTML = '';
    
    if (data.testimonials.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Aucun témoignage</td></tr>';
        return;
    }
    
    data.testimonials.forEach(testimonial => {
        const row = `
            <tr>
                <td>${escapeHtml(testimonial.author_name)}</td>
                <td>${escapeHtml(testimonial.author_position)}</td>
                <td>${escapeHtml(testimonial.content.substring(0, 80))}...</td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="dashboard.editTestimonial(Number(${testimonial.id}))">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('testimonial', Number(${testimonial.id}), this)">
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
    if (!tbody || !data?.cases) return;
    
    tbody.innerHTML = '';
    
    if (data.cases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Aucun succès d\'affaires</td></tr>';
        return;
    }
    
    data.cases.forEach(caseItem => {
        const row = `
            <tr>
                <td>${escapeHtml(caseItem.title)}</td>
                <td>${escapeHtml(caseItem.category)}</td>
                <td>${escapeHtml(caseItem.amount)}</td>
                <td><span style="color: var(--success);">${escapeHtml(caseItem.result)}</span></td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="dashboard.editCase(Number(${caseItem.id}))">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('case', Number(${caseItem.id}), this)">
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
    if (!tbody || !data?.blog) return;
    
    tbody.innerHTML = '';
    
    if (data.blog.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Aucun article de blog</td></tr>';
        return;
    }
    
    data.blog.forEach(blogItem => {
        const row = `
            <tr>
                <td>${escapeHtml(blogItem.title)}</td>
                <td>${escapeHtml(blogItem.category)}</td>
                <td>${formatDate(blogItem.created_at)}</td>
                <td>${escapeHtml(blogItem.status)}</td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="dashboard.editBlog(Number(${blogItem.id}))">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('blog', Number(${blogItem.id}), this)">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function loadFormationsTable() {
    const tbody = document.getElementById('formationsTableBody');
    if (!tbody || !data?.formations) return;
    
    tbody.innerHTML = '';
    
    if (data.formations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Aucune formation</td></tr>';
        return;
    }
    
    data.formations.forEach(formation => {
        const row = `
            <tr>
                <td><i class="${formation.icon || 'fas fa-graduation-cap'}"></i></td>
                <td>${escapeHtml(formation.title)}</td>
                <td>${escapeHtml(formation.description.substring(0, 80))}...</td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="dashboard.editFormation(Number(${formation.id}))">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('formation', Number(${formation.id}), this)">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function loadFormationRegistrationsTable() {
    const tbody = document.getElementById('formationRegistrationsTableBody');
    if (!tbody || !data?.formation_registrations) return;

    tbody.innerHTML = '';

    if (data.formation_registrations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Aucune inscription pour le moment.</td></tr>';
        return;
    }

    data.formation_registrations.forEach(item => {
        const formation = data.formations.find(f => f.id === item.formation_id);
        const formationTitle = formation ? formation.title : 'Formation inconnue';
        const statusColor = item.status === 'Confirmé' ? 'var(--success)' : 'var(--warning)';
        const row = `
            <tr>
                <td>${escapeHtml(formationTitle)}</td>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.email)}</td>
                <td>${escapeHtml(item.phone || '-')}</td>
                <td>${formatDate(item.created_at)}</td>
                <td><span style="color: ${statusColor}; font-weight: 600;">${item.status}</span></td>
                <td class="actions">
                    ${item.status !== 'Confirmé' ? 
                    `<button class="btn-action btn-edit" onclick="dashboard.confirmFormationRegistration(Number(${item.id}))">
                        <i class="fas fa-check"></i> Confirmer
                    </button>` : 
                    ''
                    }
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('formation_registration', Number(${item.id}), this)">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function confirmFormationRegistration(id) {
    const confirmBtn = event?.target?.closest('button');
    if (confirmBtn) showLoading(confirmBtn, 'Confirmation...');
    
    try {
        const result = await supabaseClient.from('formation_registrations').update({ status: 'Confirmé' }).eq('id', id);

        if (result.error) {
            throw result.error;
        }
        
        console.log(`Inscription ${id} confirmée.`);
        await window.dashboard.loadAllData();
        
    } catch (error) {
        showError(`Erreur lors de la confirmation: ${error.message}`);
        console.error('Erreur:', error);
    } finally {
        if (confirmBtn) hideLoading(confirmBtn);
    }
}

function loadAppointmentsTable() {
    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody || !data?.appointments) return;

    tbody.innerHTML = '';

    if (data.appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Aucun rendez-vous pour le moment.</td></tr>';
        return;
    }

    data.appointments.forEach(item => {
        const statusColor = item.status === 'Confirmé' ? 'var(--success)' : 'var(--warning)';
        const row = `
            <tr>
                <td>${escapeHtml(item.name)}</td>
                <td>
                    <div>${escapeHtml(item.email)}</div>
                    <div style="font-size: 0.9rem; color: var(--gray);">${escapeHtml(item.phone)}</div>
                </td>
                <td>${item.date} à ${item.time}</td>
                <td>${escapeHtml(item.service)}</td>
                <td>${escapeHtml(item.message || '-')}</td>
                <td><span style="color: ${statusColor}; font-weight: 600;">${item.status}</span></td>
                <td class="actions">
                    ${item.status !== 'Confirmé' ? 
                    `<button class="btn-action btn-edit" onclick="dashboard.confirmAppointment(Number(${item.id}))">
                        <i class="fas fa-check"></i> Confirmer
                    </button>` : 
                    `<button class="btn-action" disabled>
                        <i class="fas fa-check-circle"></i> Confirmé
                    </button>`
                    }
                    <button class="btn-action btn-delete" onclick="dashboard.confirmDelete('appointment', Number(${item.id}), this)">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function confirmAppointment(id) {
    const confirmBtn = event?.target?.closest('button');
    if (confirmBtn) showLoading(confirmBtn, 'Confirmation...');
    
    try {
        const result = await supabaseClient.from('appointments').update({ status: 'Confirmé' }).eq('id', id);

        if (result.error) {
            throw result.error;
        }
        
        console.log(`Rendez-vous ${id} confirmé.`);
        await window.dashboard.loadAllData();
        
    } catch (error) {
        showError(`Erreur lors de la confirmation: ${error.message}`);
        console.error('Erreur:', error);
    } finally {
        if (confirmBtn) hideLoading(confirmBtn);
    }
}

// ===== FONCTIONS D'ÉDITION =====

function editTeam(id) {
    console.log(`Édition team member ID: ${id}`);
    openModal('team', id);
}

function editFaq(id) {
    console.log(`Édition FAQ ID: ${id}`);
    openModal('faq', id);
}

function editDeadline(id) {
    console.log(`Édition deadline ID: ${id}`);
    openModal('deadline', id);
}

function editTestimonial(id) {
    console.log(`Édition testimonial ID: ${id}`);
    openModal('testimonial', id);
}

function editCase(id) {
    console.log(`Édition case ID: ${id}`);
    openModal('case', id);
}

function editBlog(id) {
    console.log(`Édition blog ID: ${id}`);
    openModal('blog', id);
}

function editFormation(id) {
    console.log(`Édition formation ID: ${id}`);
    openModal('formation', id);
}

// ===== SUPPRESSION =====

function confirmDelete(type, id, buttonElement) {
    console.log(`Confirmation suppression ${type} ID: ${id}`);
    
    itemToDelete = id;
    deleteType = type;
    rowToRemoveElement = buttonElement.closest('tr');
    
    // Message de confirmation
    const typeNames = {
        'team': 'membre d\'équipe',
        'faq': 'question FAQ',
        'deadline': 'délai',
        'testimonial': 'témoignage',
        'case': 'succès d\'affaires',
        'blog': 'article de blog',
        'formation': 'formation',
        'formation_registration': 'inscription à formation',
        'appointment': 'rendez-vous'
    };
    
    const typeName = typeNames[type] || 'élément';
    document.getElementById('confirmMessage').textContent = 
        `Êtes-vous sûr de vouloir supprimer ce ${typeName} ? Cette action est irréversible.`;
    
    document.getElementById('confirmModal').style.display = 'block';
}

async function deleteItem() {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    showLoading(confirmBtn, 'Suppression...');
    
    try {
        if (!itemToDelete || !deleteType) {
            throw new Error('Aucun élément à supprimer');
        }
        
        const tableMap = {
            'team': 'team_members',
            'faq': 'faq_items',
            'deadline': 'deadlines',
            'testimonial': 'testimonials',
            'case': 'case_studies',
            'blog': 'blog_posts',
            'formation': 'formations',
            'formation_registration': 'formation_registrations',
            'appointment': 'appointments'
        };
        
        const tableName = tableMap[deleteType];
        if (!tableName) {
            throw new Error(`Type inconnu: ${deleteType}`);
        }
        
        console.log(`Suppression de ${deleteType} (ID: ${itemToDelete}) dans ${tableName}`);
        
        const result = await supabaseClient
            .from(tableName)
            .delete()
            .eq('id', itemToDelete);

        if (result.error) {
            throw result.error;
        }
        
        console.log(`${deleteType} (ID: ${itemToDelete}) supprimé avec succès.`);
        
        // Supprimer la ligne du DOM
        if (rowToRemoveElement && rowToRemoveElement.parentNode) {
            rowToRemoveElement.remove();
        }
        
        // Recharger les données
        await window.dashboard.loadAllData();
        
        // Fermer le modal
        closeModal('confirm');
        
        // Reset des variables
        itemToDelete = null;
        deleteType = null;
        rowToRemoveElement = null;
        
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showError(`Erreur lors de la suppression: ${error.message}`);
    } finally {
        hideLoading(confirmBtn);
    }
}

// ===== FONCTIONS D'ENREGISTREMENT =====

async function saveTeam() {
    const saveButton = document.getElementById('saveTeamBtn');
    showLoading(saveButton, 'Enregistrement...');
    
    try {
        const id = document.getElementById('teamId').value;
        const name = document.getElementById('teamName').value.trim();
        const title = document.getElementById('teamTitle').value.trim();
        const specialty = document.getElementById('teamSpecialty').value.trim();
        const experience = parseInt(document.getElementById('teamExperience').value) || 0;
        const bio = document.getElementById('teamBio').value.trim();
        const photo_url = document.getElementById('teamPhoto').value.trim();
        const order = parseInt(document.getElementById('teamOrder').value) || 0;
        const email = document.getElementById('teamEmail').value.trim();
        const linkedin_url = document.getElementById('teamLinkedin').value.trim();

        if (!name || !title || !specialty) {
            throw new Error('Veuillez remplir les champs obligatoires (Nom, Titre, Spécialité)');
        }

        const memberData = {
            name,
            title,
            specialty,
            experience,
            bio,
            photo_url,
            order,
            email,
            linkedin_url
        };

        let result;
        if (id) {
            console.log(`Mise à jour team member ID: ${id}`, memberData);
            result = await supabaseClient.from('team_members').update(memberData).eq('id', id);
        } else {
            console.log('Création nouveau team member', memberData);
            result = await supabaseClient.from('team_members').insert([memberData]);
        }

        if (result.error) {
            throw result.error;
        }
        
        console.log('Team member enregistré avec succès.');
        await window.dashboard.loadAllData();
        closeModal('team');
        
    } catch (error) {
        console.error('Erreur saveTeam:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveFaq() {
    const saveButton = document.getElementById('saveFaqBtn');
    showLoading(saveButton, 'Enregistrement...');
    
    try {
        const id = document.getElementById('faqId').value;
        const question = document.getElementById('faqQuestion').value.trim();
        const answer = document.getElementById('faqAnswer').value.trim();
        const category = document.getElementById('faqCategory').value.trim();
        const order = parseInt(document.getElementById('faqOrder').value) || 0;

        if (!question || !answer) {
            throw new Error('Veuillez remplir la question et la réponse');
        }

        const faqData = {
            question,
            answer,
            category,
            order
        };

        let result;
        if (id) {
            result = await supabaseClient.from('faq_items').update(faqData).eq('id', id);
        } else {
            result = await supabaseClient.from('faq_items').insert([faqData]);
        }

        if (result.error) {
            throw result.error;
        }
        
        console.log('FAQ enregistrée avec succès.');
        await window.dashboard.loadAllData();
        closeModal('faq');
        
    } catch (error) {
        console.error('Erreur saveFaq:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveDeadline() {
    const saveButton = document.getElementById('saveDeadlineBtn');
    showLoading(saveButton, 'Enregistrement...');
    
    try {
        const id = document.getElementById('deadlineId').value;
        const date = document.getElementById('deadlineDate').value;
        const description = document.getElementById('deadlineDescription').value.trim();
        const type = document.getElementById('deadlineType').value.trim();
        const client = document.getElementById('deadlineClient').value.trim();
        const urgent = document.getElementById('deadlineUrgent').value === '1';
        const notes = document.getElementById('deadlineNotes').value.trim();

        if (!date || !description) {
            throw new Error('Veuillez remplir la date et la description');
        }

        const deadlineData = {
            date,
            description,
            type,
            client,
            urgent,
            notes
        };

        let result;
        if (id) {
            result = await supabaseClient.from('deadlines').update(deadlineData).eq('id', id);
        } else {
            result = await supabaseClient.from('deadlines').insert([deadlineData]);
        }

        if (result.error) {
            throw result.error;
        }
        
        console.log('Délai enregistré avec succès.');
        await window.dashboard.loadAllData();
        closeModal('deadline');
        
    } catch (error) {
        console.error('Erreur saveDeadline:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveTestimonial() {
    const saveButton = document.getElementById('saveTestimonialBtn');
    showLoading(saveButton, 'Enregistrement...');
    
    try {
        const id = document.getElementById('testimonialId').value;
        const author_name = document.getElementById('testimonialName').value.trim();
        const author_position = document.getElementById('testimonialPosition').value.trim();
        const content = document.getElementById('testimonialContent').value.trim();
        const author_photo_url = document.getElementById('testimonialPhoto').value.trim();
        const rating = parseInt(document.getElementById('testimonialRating').value) || 5;
        const date = document.getElementById('testimonialDate').value || new Date().toISOString().split('T')[0];

        if (!author_name || !content) {
            throw new Error('Veuillez remplir le nom et le contenu du témoignage');
        }

        const testimonialData = {
            author_name,
            author_position,
            content,
            author_photo_url,
            rating,
            date
        };

        let result;
        if (id) {
            result = await supabaseClient.from('testimonials').update(testimonialData).eq('id', id);
        } else {
            result = await supabaseClient.from('testimonials').insert([testimonialData]);
        }

        if (result.error) {
            throw result.error;
        }
        
        console.log('Témoignage enregistré avec succès.');
        await window.dashboard.loadAllData();
        closeModal('testimonial');
        
    } catch (error) {
        console.error('Erreur saveTestimonial:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveCase() {
    const saveButton = document.getElementById('saveCaseBtn');
    showLoading(saveButton, 'Enregistrement...');
    
    try {
        const id = document.getElementById('caseId').value;
        const title = document.getElementById('caseTitle').value.trim();
        const description = document.getElementById('caseDescription').value.trim();
        const category = document.getElementById('caseCategory').value.trim();
        const resultText = document.getElementById('caseResult').value.trim();
        const amount = document.getElementById('caseAmount').value.trim();
        const duration = document.getElementById('caseDuration').value.trim();
        const outcome = document.getElementById('caseOutcome').value.trim();

        if (!title || !description || !resultText) {
            throw new Error('Veuillez remplir les champs obligatoires (Titre, Description, Résultat)');
        }

        const caseData = {
            title,
            description,
            category,
            result: resultText,
            amount,
            duration,
            outcome
        };

        let result;
        if (id) {
            result = await supabaseClient.from('case_studies').update(caseData).eq('id', id);
        } else {
            result = await supabaseClient.from('case_studies').insert([caseData]);
        }

        if (result.error) {
            throw result.error;
        }
        
        console.log('Cas enregistré avec succès.');
        await window.dashboard.loadAllData();
        closeModal('case');
        
    } catch (error) {
        console.error('Erreur saveCase:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveBlog() {
    const saveButton = document.getElementById('saveBlogBtn');
    showLoading(saveButton, 'Enregistrement...');
    
    try {
        const id = document.getElementById('blogId').value;
        const title = document.getElementById('blogTitle').value.trim();
        const excerpt = document.getElementById('blogExcerpt').value.trim();
        const content = document.getElementById('blogContent').value.trim();
        const category = document.getElementById('blogCategory').value.trim();
        const author = document.getElementById('blogAuthor').value.trim();
        const created_at = document.getElementById('blogDate').value || new Date().toISOString().split('T')[0];
        const image_url = document.getElementById('blogImage').value.trim();
        const status = document.getElementById('blogStatus').value;

        if (!title || !content) {
            throw new Error('Veuillez remplir le titre et le contenu');
        }

        const blogData = {
            title,
            excerpt,
            content,
            category,
            author,
            created_at,
            image_url,
            status
        };

        let result;
        if (id) {
            result = await supabaseClient.from('blog_posts').update(blogData).eq('id', id);
        } else {
            result = await supabaseClient.from('blog_posts').insert([blogData]);
        }

        if (result.error) {
            throw result.error;
        }
        
        console.log('Blog enregistré avec succès.');
        await window.dashboard.loadAllData();
        closeModal('blog');
        
    } catch (error) {
        console.error('Erreur saveBlog:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveFormation() {
    const saveButton = document.getElementById('saveFormationBtn');
    showLoading(saveButton, 'Enregistrement...');
    
    try {
        const id = document.getElementById('formationId').value;
        const title = document.getElementById('formationTitle').value.trim();
        const description = document.getElementById('formationDescription').value.trim();
        const icon = document.getElementById('formationIcon').value.trim();

        if (!title || !description) {
            throw new Error('Veuillez remplir le titre et la description');
        }

        const formationData = {
            title,
            description,
            icon
        };

        let result;
        if (id) {
            result = await supabaseClient.from('formations').update(formationData).eq('id', id);
        } else {
            result = await supabaseClient.from('formations').insert([formationData]);
        }

        if (result.error) {
            throw result.error;
        }
        
        console.log('Formation enregistrée avec succès.');
        await window.dashboard.loadAllData();
        closeModal('formation');
        
    } catch (error) {
        console.error('Erreur saveFormation:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveGeneralSettings() {
    const saveButton = document.querySelector('#generalSettingsForm button[type="submit"]');
    showLoading(saveButton, 'Enregistrement...');
    
    try {
        const site_name = document.getElementById('siteName').value.trim();
        const contact_email = document.getElementById('siteEmail').value.trim();
        const contact_phone = document.getElementById('sitePhone').value.trim();
        const address = document.getElementById('siteAddress').value.trim();
        const description = document.getElementById('siteDescription').value.trim();

        const settingsData = {
            site_name,
            contact_email,
            contact_phone,
            address,
            description
        };

        const result = await supabaseClient.from('site_settings').update(settingsData).eq('id', 1);

        if (result.error) {
            throw result.error;
        }
        
        console.log('Paramètres généraux enregistrés.');
        await window.dashboard.loadAllData();
        showSuccess('Paramètres enregistrés avec succès');
        
    } catch(error) {
        console.error('Erreur saveGeneralSettings:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveSecuritySettings() {
    const saveButton = document.querySelector('#securitySettingsForm button[type="submit"]');
    showLoading(saveButton, 'Mise à jour...');
    
    try {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!newPassword || !confirmPassword) {
            throw new Error('Veuillez remplir tous les champs');
        }

        if (newPassword !== confirmPassword) {
            throw new Error('Les mots de passe ne correspondent pas');
        }

        if (newPassword.length < 6) {
            throw new Error('Le mot de passe doit contenir au moins 6 caractères');
        }

        const result = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (result.error) {
            throw result.error;
        }
        
        console.log('Mot de passe mis à jour.');
        showSuccess('Mot de passe mis à jour avec succès. Vous allez être déconnecté.');
        
        setTimeout(async () => {
            await supabaseClient.auth.signOut();
            window.location.href = 'index.html';
        }, 2000);
        
    } catch(error) {
        console.error('Erreur saveSecuritySettings:', error);
        showError(`Erreur: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

// ===== FONCTIONS UTILITAIRES =====

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

function showWarning(message) {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff9800;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    warningDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(warningDiv);
    
    setTimeout(() => {
        if (warningDiv.parentNode) {
            warningDiv.remove();
        }
    }, 4000);
}

function showLoading(button, loadingText = 'Chargement...') {
    if (!button) return;
    
    button.disabled = true;
    button.dataset.originalHtml = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
}

function hideLoading(button) {
    if (!button) return;
    
    button.disabled = false;
    if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
    }
}