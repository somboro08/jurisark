 let data = {};
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

   
    let currentSection = 'dashboard';
    let currentModal = null;
    let itemToDelete = null;
    let deleteType = null;

    // Vérifier l'authentification
    checkAuth();

    // Afficher le nom d'utilisateur (logic moved to checkAuth)
    // const username = sessionStorage.getItem('admin_username') || 'Administrateur';
    // document.getElementById('userName').textContent = username;

    // Charger les données depuis les fichiers Supabase
    async function loadAllData() {
        const { data: teamData, error: teamError } = await supabaseClient.from('team_members').select('*');
        const { data: faqData, error: faqError } = await supabaseClient.from('faq_items').select('*');
        const { data: deadlinesData, error: deadlinesError } = await supabaseClient.from('deadlines').select('*');
        const { data: testimonialsData, error: testimonialsError } = await supabaseClient.from('testimonials').select('*');
        const { data: casesData, error: casesError } = await supabaseClient.from('case_studies').select('*');
        const { data: blogData, error: blogError } = await supabaseClient.from('blog_posts').select('*');
        const { data: settingsData, error: settingsError } = await supabaseClient.from('site_settings').select('*');
        const { data: activitiesData, error: activitiesError } = await supabaseClient.from('activities').select('*');
        const { data: appointmentsData, error: appointmentsError } = await supabaseClient.from('appointments').select('*');
        const { data: formationsData, error: formationsError } = await supabaseClient.from('formations').select('*');
        const { data: formationRegistrationsData, error: formationRegistrationsError } = await supabaseClient.from('formation_registrations').select('*');

        if (teamError) console.error("Error fetching team_members:", teamError.message);
        if (faqError) console.error("Error fetching faq_items:", faqError.message);
        if (deadlinesError) console.error("Error fetching deadlines:", deadlinesError.message);
        if (testimonialsError) console.error("Error fetching testimonials:", testimonialsError.message);
        if (casesError) console.error("Error fetching case_studies:", casesError.message);
        if (blogError) console.error("Error fetching blog_posts:", blogError.message);
        if (settingsError) console.error("Error fetching site_settings:", settingsError.message);
        if (activitiesError) console.error("Error fetching activities:", activitiesError.message);
        if (appointmentsError) console.error("Error fetching appointments:", appointmentsError.message);
        if (formationsError) console.error("Error fetching formations:", formationsError.message);
        if (formationRegistrationsError) console.error("Error fetching formation_registrations:", formationRegistrationsError.message);

        data = {
            team: teamData || [],
            faq: faqData || [],
            deadlines: deadlinesData || [],
            testimonials: testimonialsData || [],
            cases: casesData || [],
            blog: blogData || [],
            settings: settingsData && settingsData.length > 0 ? settingsData[0] : {}, // Assuming settings is a single row
            activities: activitiesData || [],
            appointments: appointmentsData || [],
            formations: formationsData || [],
            formation_registrations: formationRegistrationsData || [],
        };
        
        console.log('Data loaded from Supabase:', data);

        // Initialiser l'interface avec les données chargées
        updateStats();
        loadActivities();
        initNavigation();
        
        // Initialiser le tableau de la section active
        if (currentSection !== 'dashboard' && currentSection !== 'settings') {
            loadSectionData(currentSection);
        }
    }

    loadAllData();

    initModals(); // Initialize modal functionality
});


function initModals() {
    // Add Event Listeners for "Add" buttons
    document.getElementById('addTeamBtn')?.addEventListener('click', () => openModal('team'));
    document.getElementById('addFaqBtn')?.addEventListener('click', () => openModal('faq'));
    document.getElementById('addDeadlineBtn')?.addEventListener('click', () => openModal('deadline'));
    document.getElementById('addTestimonialBtn')?.addEventListener('click', () => openModal('testimonial'));
    document.getElementById('addCaseBtn')?.addEventListener('click', () => openModal('case'));
    document.getElementById('addBlogBtn')?.addEventListener('click', () => openModal('blog'));
    document.getElementById('addFormationBtn')?.addEventListener('click', () => openModal('formation'));

    // Close Modals with .modal-close or .btn-cancel buttons
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(button => {
        const modalId = button.getAttribute('data-modal');
        if (modalId) {
            button.addEventListener('click', () => closeModal(modalId));
        }
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Save buttons event listeners
    document.getElementById('saveTeamBtn')?.addEventListener('click', saveTeam);
    document.getElementById('saveFaqBtn')?.addEventListener('click', saveFaq);
    document.getElementById('saveDeadlineBtn')?.addEventListener('click', saveDeadline);
    document.getElementById('saveTestimonialBtn')?.addEventListener('click', saveTestimonial);
    document.getElementById('saveCaseBtn')?.addEventListener('click', saveCase);
    document.getElementById('saveBlogBtn')?.addEventListener('click', saveBlog);
    document.getElementById('saveFormationBtn')?.addEventListener('click', saveFormation);
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', deleteItem);


    document.getElementById('generalSettingsForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveGeneralSettings();
    });

    document.getElementById('securitySettingsForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveSecuritySettings();
    });
};

function openModal(type, id = null) {
    const modalId = type + 'Modal';
    currentModal = document.getElementById(modalId);
    if (currentModal) {
        currentModal.style.display = 'block';
        // Reset form
        const form = document.getElementById(type + 'Form');
        if (form) {
            form.reset();
        }
        // Specific resets for hidden IDs
        const idInput = document.getElementById(type + 'Id');
        if (idInput) {
            idInput.value = '';
        }
        
        // Set title
        const titleEl = document.getElementById(type + 'ModalTitle');
        if(titleEl) {
            titleEl.textContent = id ? `Modifier ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Ajouter ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }
    }
}

function closeModal(modalId) {
    if (!modalId) return;
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
    currentModal = null;
}

// ===== AUTHENTIFICATION =====

async function checkAuth() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error || !session) {
        window.location.href = 'index.html';
    } else {
        // Set username from session
        const username = session.user.email || 'Administrateur';
        document.getElementById('userName').textContent = username;
    }
}

document.getElementById('logoutBtn').addEventListener('click', async function() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
    }
    sessionStorage.removeItem('admin_logged_in'); // Keep for backward compatibility if needed, though Supabase handles it
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
    const sectionElement = document.getElementById(section + 'Section');
    if (sectionElement) {
        sectionElement.style.display = 'block';
        
        // Mettre à jour le titre de la page
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
        currentSection = section;
        
        // Charger les données spécifiques à la section
        if (section !== 'dashboard' && section !== 'settings') {
            loadSectionData(section);
        }
    }
}

// ===== CHARGEMENT DES DONNÉES =====

// Supprimez la fonction loadData() complètement ou gardez-la vide
function loadData() {
    // Cette fonction n'est plus nécessaire car on charge directement dans le Promise
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
    // Check if data is defined
    if (!data) {
        console.warn("Données non chargées pour les statistiques");
        return;
    }
    
    document.getElementById('teamCount').textContent = data.team?.length || 0;
    document.getElementById('faqCount').textContent = data.faq?.length || 0;
    document.getElementById('testimonialsCount').textContent = data.testimonials?.length || 0;
    document.getElementById('casesCount').textContent = data.cases?.length || 0;
    document.getElementById('appointmentsCount').textContent = data.appointments?.length || 0;
}

async function loadActivities() {
    const container = document.getElementById('activityList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Check if data is defined
    if (!data || !data.activities) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--gray);">Aucune activité récente</div>';
        return;
    }
    
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
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (e) {
        return dateString;
    }
}

// ===== GESTION DES TABLES =====

function loadTeamTable() {
    const tbody = document.getElementById('teamTableBody');
    if (!tbody || !data?.team) return;
    
    tbody.innerHTML = '';
    
    data.team.sort((a, b) => a.order - b.order).forEach(member => {
        const row = `
            <tr>
                <td>
                    <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden;">
                        <img src="${member.photo_url}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover;">
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
    if (!tbody || !data?.faq) return;
    
    tbody.innerHTML = '';
    
    data.faq.sort((a, b) => a.order - b.order).forEach(item => {
        const row = `
            <tr>
                <td>${item.id}</td>
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
    if (!tbody || !data?.deadlines) return;
    
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
    if (!tbody || !data?.testimonials) return;
    
    tbody.innerHTML = '';
    
    data.testimonials.forEach(testimonial => {
        const row = `
            <tr>
                <td>${testimonial.author_name}</td>
                <td>${testimonial.author_position}</td>
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
    if (!tbody || !data?.cases) return;
    
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
    if (!tbody || !data?.blog) return;
    
    tbody.innerHTML = '';
    
    data.blog.forEach(blogItem => {
        const row = `
            <tr>
                <td>${blogItem.title}</td>
                <td>${blogItem.category}</td>
                <td>${formatDate(blogItem.created_at)}</td>
                <td>${blogItem.status}</td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="editBlog(${blogItem.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="confirmDelete('blog', ${blogItem.id})">
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
    
    data.formations.forEach(formation => {
        const row = `
            <tr>
                <td><i class="${formation.icon}"></i></td>
                <td>${formation.title}</td>
                <td>${formation.description}</td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="editFormation(${formation.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-action btn-delete" onclick="confirmDelete('formation', ${formation.id})">
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
                <td>${formationTitle}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone || '-'}</td>
                <td>${formatDate(item.created_at)}</td>
                <td><span style="color: ${statusColor}; font-weight: 600;">${item.status}</span></td>
                <td class="actions">
                    ${item.status !== 'Confirmé' ? 
                    `<button class="btn-action btn-edit" onclick="confirmFormationRegistration(${item.id})">
                        <i class="fas fa-check"></i> Confirmer
                    </button>` : 
                    ''
                    }
                    <button class="btn-action btn-delete" onclick="confirmDelete('formation_registration', ${item.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function confirmFormationRegistration(id) {
    const { error } = await supabaseClient.from('formation_registrations').update({ status: 'Confirmé' }).eq('id', id);

    if (error) {
        showError(`Erreur lors de la confirmation de l'inscription: ${error.message}`);
    } else {
        console.log(`Registration ${id} confirmed.`);
        await loadAllData(); 
    }
}


function editFormation(id) {
    openModal('formation', id);
    const formation = data.formations.find(f => f.id === id);
    if (formation) {
        document.getElementById('formationId').value = formation.id;
        document.getElementById('formationTitle').value = formation.title;
        document.getElementById('formationDescription').value = formation.description;
        document.getElementById('formationIcon').value = formation.icon;
    }
}

async function saveFormation() {
    const id = document.getElementById('formationId').value;
    const title = document.getElementById('formationTitle').value;
    const description = document.getElementById('formationDescription').value;
    const icon = document.getElementById('formationIcon').value;

    const formationData = {
        title,
        description,
        icon
    };

    let error = null;
    if (id) {
        // Update existing formation
        ({ error } = await supabaseClient.from('formations').update(formationData).eq('id', id));
    } else {
        // Insert new formation
        ({ error } = await supabaseClient.from('formations').insert([formationData]));
    }

    if (error) {
        showError(`Erreur lors de l'enregistrement de la formation: ${error.message}`);
    } else {
        console.log('Formation enregistrée avec succès.');
        await loadAllData();
        closeModal('formation');
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
                <td>${item.name}</td>
                <td>
                    <div>${item.email}</div>
                    <div style="font-size: 0.9rem; color: var(--gray);">${item.phone}</div>
                </td>
                <td>${item.date} à ${item.time}</td>
                <td>${item.service}</td>
                <td>${item.message || '-'}</td>
                <td><span style="color: ${statusColor}; font-weight: 600;">${item.status}</span></td>
                <td class="actions">
                    ${item.status !== 'Confirmé' ? 
                    `<button class="btn-action btn-edit" onclick="confirmAppointment(${item.id})">
                        <i class="fas fa-check"></i> Confirmer
                    </button>` : 
                    `<button class="btn-action" disabled>
                        <i class="fas fa-check-circle"></i> Confirmé
                    </button>`
                    }
                    <button class="btn-action btn-delete" onclick="confirmDelete('appointment', ${item.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function confirmAppointment(id) {
    const appointment = data.appointments.find(a => a.id === id);
    if (appointment) {
        // Update in Supabase
        const { error } = await supabaseClient.from('appointments').update({ status: 'Confirmé' }).eq('id', id);

        if (error) {
            showError(`Erreur lors de la confirmation du rendez-vous: ${error.message}`);
        } else {
            console.log(`Appointment ${appointment.name} on ${appointment.date} for ${appointment.service} confirmed in Supabase.`);
            await loadAllData(); // Reload all data to refresh tables
        }
    }
}

// ===== FONCTIONS UTILITAIRES =====

function showError(message) {
    // Créer un élément d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Retirer après 5 secondes
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// ===== FONCTIONS D'ÉDITION/SUPPRESSION =====

function editTeam(id) {
    openModal('team', id);
    const member = data.team.find(m => m.id === id);
    if (member) {
        document.getElementById('teamId').value = member.id;
        document.getElementById('teamName').value = member.name;
        document.getElementById('teamTitle').value = member.title;
        document.getElementById('teamSpecialty').value = member.specialty;
        document.getElementById('teamExperience').value = member.experience;
        document.getElementById('teamBio').value = member.bio;
        document.getElementById('teamPhoto').value = member.photo_url;
        document.getElementById('teamOrder').value = member.order;
        document.getElementById('teamEmail').value = member.email || '';
        document.getElementById('teamLinkedin').value = member.linkedin_url || '';
    }
}

function confirmDelete(type, id) {
    itemToDelete = id;
    deleteType = type;
    document.getElementById('confirmMessage').textContent = `Êtes-vous sûr de vouloir supprimer cet élément de ${type} (ID: ${id}) ?`;
    document.getElementById('confirmModal').style.display = 'block';
}

async function deleteItem() {
    let error = null;
    let tableName = '';

    switch (deleteType) {
        case 'team':
            tableName = 'team_members';
            break;
        case 'faq':
            tableName = 'faq_items';
            break;
        case 'deadline':
            tableName = 'deadlines';
            break;
        case 'testimonial':
            tableName = 'testimonials';
            break;
        case 'case':
            tableName = 'case_studies';
            break;
        case 'blog':
            tableName = 'blog_posts';
            break;
        case 'formation':
            tableName = 'formations';
            break;
        case 'formation_registration':
            tableName = 'formation_registrations';
            break;
        case 'appointment':
            tableName = 'appointments';
            break;
        default:
            showError('Type de suppression inconnu.');
            closeModal('confirm');
            return;
    }
    

    ({ error } = await supabaseClient.from(tableName).delete().eq('id', itemToDelete));

    if (error) {
        showError(`Erreur lors de la suppression: ${error.message}`);
    } else {
        console.log(`Élément de ${deleteType} (ID: ${itemToDelete}) supprimé avec succès.`);
        await loadAllData();
        closeModal('confirm');
    }
}

function editFaq(id) {
    openModal('faq', id);
    const faqItem = data.faq.find(f => f.id === id);
    if (faqItem) {
        document.getElementById('faqId').value = faqItem.id;
        document.getElementById('faqQuestion').value = faqItem.question;
        document.getElementById('faqAnswer').value = faqItem.answer;
        document.getElementById('faqCategory').value = faqItem.category;
        document.getElementById('faqOrder').value = faqItem.order;
    }
}

function editDeadline(id) {
    openModal('deadline', id);
    const deadlineItem = data.deadlines.find(d => d.id === id);
    if (deadlineItem) {
        document.getElementById('deadlineId').value = deadlineItem.id;
        document.getElementById('deadlineDate').value = deadlineItem.date;
        document.getElementById('deadlineDescription').value = deadlineItem.description;
        document.getElementById('deadlineType').value = deadlineItem.type;
        document.getElementById('deadlineClient').value = deadlineItem.client;
        document.getElementById('deadlineUrgent').value = deadlineItem.urgent ? '1' : '0';
        document.getElementById('deadlineNotes').value = deadlineItem.notes;
    }
}

function editTestimonial(id) {
    openModal('testimonial', id);
    const testimonialItem = data.testimonials.find(t => t.id === id);
    if (testimonialItem) {
        document.getElementById('testimonialId').value = testimonialItem.id;
        document.getElementById('testimonialName').value = testimonialItem.author_name;
        document.getElementById('testimonialPosition').value = testimonialItem.author_position;
        document.getElementById('testimonialContent').value = testimonialItem.content;
        document.getElementById('testimonialPhoto').value = testimonialItem.author_photo_url;
        document.getElementById('testimonialRating').value = testimonialItem.rating;
        document.getElementById('testimonialDate').value = testimonialItem.date;
    }
}

function editCase(id) {
    openModal('case', id);
    const caseItem = data.cases.find(c => c.id === id);
    if (caseItem) {
        document.getElementById('caseId').value = caseItem.id;
        document.getElementById('caseTitle').value = caseItem.title;
        document.getElementById('caseDescription').value = caseItem.description;
        document.getElementById('caseCategory').value = caseItem.category;
        document.getElementById('caseResult').value = caseItem.result;
        document.getElementById('caseAmount').value = caseItem.amount;
        document.getElementById('caseDuration').value = caseItem.duration;
        document.getElementById('caseOutcome').value = caseItem.outcome;
    }
}

function editBlog(id) {
    openModal('blog', id);
    const blogItem = data.blog.find(b => b.id === id);
    if (blogItem) {
        document.getElementById('blogId').value = blogItem.id;
        document.getElementById('blogTitle').value = blogItem.title;
        document.getElementById('blogExcerpt').value = blogItem.excerpt;
        document.getElementById('blogContent').value = blogItem.content;
        document.getElementById('blogCategory').value = blogItem.category;
        document.getElementById('blogAuthor').value = blogItem.author;
        document.getElementById('blogDate').value = blogItem.created_at ? blogItem.created_at.split('T')[0] : ''; // Supabase timestamps are ISO strings
        document.getElementById('blogImage').value = blogItem.image_url;
        document.getElementById('blogStatus').value = blogItem.status;
    }
}

async function saveTeam() {
    const saveButton = document.getElementById('saveTeamBtn'); // Get button reference
    showLoading(saveButton, 'Enregistrement...'); // Show loading state

    const id = document.getElementById('teamId').value;
    const name = document.getElementById('teamName').value;
    const title = document.getElementById('teamTitle').value;
    const specialty = document.getElementById('teamSpecialty').value;
    const experience = parseInt(document.getElementById('teamExperience').value);
    const bio = document.getElementById('teamBio').value;
    const photo_url = document.getElementById('teamPhoto').value;
    const order = parseInt(document.getElementById('teamOrder').value);
    const email = document.getElementById('teamEmail').value;
    const linkedin_url = document.getElementById('teamLinkedin').value;

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

    let error = null;
    if (id) {
        // Update existing member
        ({ error } = await supabaseClient.from('team_members').update(memberData).eq('id', id));
    } else {
        // Insert new member
        ({ error } = await supabaseClient.from('team_members').insert([memberData]));
    }

    if (error) {
        showError(`Erreur lors de l'enregistrement du membre de l'équipe: ${error.message}`);
    } else {
        console.log('Membre de l\'équipe enregistré avec succès.');
        await loadAllData(); // Reload all data to refresh tables
        closeModal('team');
    }
    hideLoading(saveButton); // Hide loading state
}

async function saveFaq() {
    const saveButton = document.getElementById('saveFaqBtn');
    showLoading(saveButton, 'Enregistrement...');
    try {
        const id = document.getElementById('faqId').value;
        const question = document.getElementById('faqQuestion').value;
        const answer = document.getElementById('faqAnswer').value;
        const category = document.getElementById('faqCategory').value;
        const order = parseInt(document.getElementById('faqOrder').value);

        const faqData = {
            question,
            answer,
            category,
            order
        };

        let error = null;
        if (id) {
            ({ error } = await supabaseClient.from('faq_items').update(faqData).eq('id', id));
        } else {
            ({ error } = await supabaseClient.from('faq_items').insert([faqData]));
        }

        if (error) {
            throw error;
        } else {
            console.log('FAQ enregistrée avec succès.');
            await loadAllData();
            closeModal('faqModal');
        }
    } catch (error) {
        showError(`Erreur lors de l'enregistrement de la FAQ: ${error.message}`);
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
        const description = document.getElementById('deadlineDescription').value;
        const type = document.getElementById('deadlineType').value;
        const client = document.getElementById('deadlineClient').value;
        const urgent = document.getElementById('deadlineUrgent').value === '1';
        const notes = document.getElementById('deadlineNotes').value;

        const deadlineData = {
            date,
            description,
            type,
            client,
            urgent,
            notes
        };

        let error = null;
        if (id) {
            ({ error } = await supabaseClient.from('deadlines').update(deadlineData).eq('id', id));
        } else {
            ({ error } = await supabaseClient.from('deadlines').insert([deadlineData]));
        }

        if (error) {
            throw error;
        } else {
            console.log('Délai enregistré avec succès.');
            await loadAllData();
            closeModal('deadlineModal');
        }
    } catch (error) {
        showError(`Erreur lors de l'enregistrement du délai: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveTestimonial() {
    const saveButton = document.getElementById('saveTestimonialBtn');
    showLoading(saveButton, 'Enregistrement...');
    try {
        const id = document.getElementById('testimonialId').value;
        const author_name = document.getElementById('testimonialName').value;
        const author_position = document.getElementById('testimonialPosition').value;
        const content = document.getElementById('testimonialContent').value;
        const author_photo_url = document.getElementById('testimonialPhoto').value;
        const rating = parseInt(document.getElementById('testimonialRating').value);
        const date = document.getElementById('testimonialDate').value;

        const testimonialData = {
            author_name,
            author_position,
            content,
            author_photo_url,
            rating,
            date
        };

        let error = null;
        if (id) {
            ({ error } = await supabaseClient.from('testimonials').update(testimonialData).eq('id', id));
        } else {
            ({ error } = await supabaseClient.from('testimonials').insert([testimonialData]));
        }

        if (error) {
            throw error;
        } else {
            console.log('Témoignage enregistré avec succès.');
            await loadAllData();
            closeModal('testimonialModal');
        }
    } catch (error) {
        showError(`Erreur lors de l'enregistrement du témoignage: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveCase() {
    const saveButton = document.getElementById('saveCaseBtn');
    showLoading(saveButton, 'Enregistrement...');
    try {
        const id = document.getElementById('caseId').value;
        const title = document.getElementById('caseTitle').value;
        const description = document.getElementById('caseDescription').value;
        const category = document.getElementById('caseCategory').value;
        const result = document.getElementById('caseResult').value;
        const amount = document.getElementById('caseAmount').value;
        const duration = document.getElementById('caseDuration').value;
        const outcome = document.getElementById('caseOutcome').value;

        const caseData = {
            title,
            description,
            category,
            result,
            amount,
            duration,
            outcome
        };

        let error = null;
        if (id) {
            ({ error } = await supabaseClient.from('case_studies').update(caseData).eq('id', id));
        } else {
            ({ error } = await supabaseClient.from('case_studies').insert([caseData]));
        }

        if (error) {
            throw error;
        } else {
            console.log('Succès d\'affaires enregistré avec succès.');
            await loadAllData();
            closeModal('caseModal');
        }
    } catch (error) {
        showError(`Erreur lors de l'enregistrement du succès d'affaires: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveBlog() {
    const saveButton = document.getElementById('saveBlogBtn');
    showLoading(saveButton, 'Enregistrement...');
    try {
        const id = document.getElementById('blogId').value;
        const title = document.getElementById('blogTitle').value;
        const excerpt = document.getElementById('blogExcerpt').value;
        const content = document.getElementById('blogContent').value;
        const category = document.getElementById('blogCategory').value;
        const author = document.getElementById('blogAuthor').value;
        const created_at = document.getElementById('blogDate').value;
        const image_url = document.getElementById('blogImage').value;
        const status = document.getElementById('blogStatus').value;

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

        let error = null;
        if (id) {
            ({ error } = await supabaseClient.from('blog_posts').update(blogData).eq('id', id));
        } else {
            ({ error } = await supabaseClient.from('blog_posts').insert([blogData]));
        }

        if (error) {
            throw error;
        } else {
            console.log('Article de blog enregistré avec succès.');
            await loadAllData();
            closeModal('blogModal');
        }
    } catch (error) {
        showError(`Erreur lors de l'enregistrement de l'article de blog: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

async function saveGeneralSettings() {
    const saveButton = document.querySelector('#generalSettingsForm button[type="submit"]');
    showLoading(saveButton, 'Enregistrement...');
    try {
        const site_name = document.getElementById('siteName').value;
        const contact_email = document.getElementById('siteEmail').value;
        const contact_phone = document.getElementById('sitePhone').value;
        const address = document.getElementById('siteAddress').value;
        const description = document.getElementById('siteDescription').value;

        const settingsData = {
            site_name,
            contact_email,
            contact_phone,
            address,
            description
        };

        const { error } = await supabaseClient.from('site_settings').update(settingsData).eq('id', 1);

        if (error) {
            throw error;
        } else {
            console.log('Paramètres généraux enregistrés avec succès.');
            await loadAllData();
        }
    } catch(error) {
        showError(`Erreur lors de l'enregistrement des paramètres généraux: ${error.message}`);
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
            showError('Veuillez remplir tous les champs de mot de passe.');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) {
            throw error;
        } else {
            console.log('Mot de passe mis à jour avec succès. Vous serez déconnecté pour appliquer les changements.');
            alert('Mot de passe mis à jour avec succès. Veuillez vous reconnecter.');
            await supabaseClient.auth.signOut();
            window.location.href = 'index.html';
        }
    } catch(error) {
        showError(`Erreur lors de la mise à jour du mot de passe: ${error.message}`);
    } finally {
        hideLoading(saveButton);
    }
}

function showLoading(button, loadingText = 'Chargement...') {
    button.disabled = true;
    button.dataset.originalHtml = button.innerHTML; // Store original content
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
}

function hideLoading(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalHtml; // Restore original content
}
