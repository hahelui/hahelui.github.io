// Language content
const languageContent = {
    en: {
        whoami: `Hi, I'm Hachem, a 24-year-old software developer and manager from Nouadhibou, Mauritania. Passionate about technology since the age of 4, I thrive on challenges that push my limits.`,
        experience: {
            title: "Experience",
            healthcare: {
                title: "Manager",
                description: "Currently managing Clinique Nouadhibou, I combine leadership skills with a passion for improving healthcare services through technology."
            },
            developer: {
                title: "Developer",
                description: "I specialize in Python, JavaScript, and Flutter/Dart, creating dynamic applications and solving complex problems. I see every project as an opportunity to grow and innovate."
            }
        },
        contact: {
            title: "Contact Me",
            message: "Let's create something amazing together."
        }
    },
    fr: {
        whoami: `Je m'appelle Hachem, j'ai 24 ans et je suis originaire de Nouadhibou, en Mauritanie. Passionné par la technologie depuis l'âge de 4 ans, je vois chaque défi comme une occasion d'élargir mes compétences.`,
        experience: {
            title: "Expériences",
            healthcare: {
                title: "Gérant",
                description: "Actuellement Gérant de la Clinique de Nouadhibou, j'utilise mes compétences en gestion et en technologie pour améliorer les services de santé."
            },
            developer: {
                title: "Développeur",
                description: "Spécialisé en Python, JavaScript et Flutter/Dart, je crée des applications dynamiques et je résous des problèmes complexes, chaque projet étant une opportunité de progresser et d'innover."
            }
        },
        contact: {
            title: "Contactez-moi",
            message: "Créons ensemble quelque chose d'extraordinaire."
        }
    },
    ar: {
        whoami: `اسمي هاشم، عمري 24 عامًا، من مواليد مدينة نواذيبو في موريتانيا. أحببت التكنولوجيا منذ سن الرابعة وأسعى دائمًا لاقتناص التحديات لتطوير مهاراتي.`,
        experience: {
            title: "الخبرات",
            healthcare: {
                title: "مدير مصحة نواذيبو",
                description: "أشغل دورا بالإدارة في مصحة نواذيبو، حيث أوظف قدراتي الإدارية والتقنية لتحسين جودة الخدمات الصحية."
            },
            developer: {
                title: "مطور",
                description: "مختص في Python، JavaScript و Flutter/Dart، أعمل على تطوير تطبيقات ديناميكية وحل المشكلات المعقّدة، وأرى في كل مشروع فرصة للنمو والابتكار."
            }
        },
        contact: {
            title: "تواصل معي",
            message: "دعنا نبتكر شيئًا مميزًا معًا."
        }
    }
};

// Current language
let currentLang = 'en';

// Function to update content based on selected language
function updateContent(lang) {
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update content
    document.getElementById('whoami-text').textContent = languageContent[lang].whoami;
    
    // Update experience section
    const exp = languageContent[lang].experience;
    document.querySelector('#experience h2').textContent = exp.title;
    document.querySelector('#experience .card:nth-child(1) h3').textContent = exp.healthcare.title;
    document.querySelector('#experience .card:nth-child(1) p').textContent = exp.healthcare.description;
    document.querySelector('#experience .card:nth-child(2) h3').textContent = exp.developer.title;
    document.querySelector('#experience .card:nth-child(2) p').textContent = exp.developer.description;
    
    // Update contact section
    const contact = languageContent[lang].contact;
    document.querySelector('#contact h2').textContent = contact.title;
    document.querySelector('#contact .card > p').textContent = contact.message;
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                updateContent(lang);
            }
        });
    });

    // Initialize with English content
    updateContent('en');
});
