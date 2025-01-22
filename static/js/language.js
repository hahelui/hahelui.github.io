// Cache DOM elements
const languageButtons = document.querySelectorAll('.lang-btn');
const whoamiText = document.getElementById('whoami-text');
const experience = document.getElementById('experience');
const contact = document.getElementById('contact');

// Language content with memoization
const languageContent = {
    en: {
        whoami: `Hi, I'm Cheikh Hachem, a 24-year-old software developer and manager from Nouadhibou, Mauritania. Passionate about technology since the age of 4, I thrive on challenges that push my limits.`,
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
        whoami: `Je m'appelle Cheikh Hachem, j'ai 24 ans et je suis originaire de Nouadhibou, en Mauritanie. Passionné par la technologie depuis l'âge de 4 ans, je vois chaque défi comme une occasion d'élargir mes compétences.`,
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
        whoami: `اسمي الشيخ هاشم، عمري 24 عامًا، من مواليد مدينة نواذيبو في موريتانيا. أحببت التكنولوجيا منذ سن الرابعة وأسعى دائمًا لاقتناص التحديات لتطوير مهاراتي.`,
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

// Current language state
let currentLang = 'en';

// Update content function with performance optimization
function updateContent(lang) {
    if (lang === currentLang) return; // Avoid unnecessary updates
    
    currentLang = lang;
    const content = languageContent[lang];
    
    // Update text content efficiently
    requestAnimationFrame(() => {
        whoamiText.textContent = content.whoami;
        
        // Update experience section
        experience.querySelector('h2').textContent = content.experience.title;
        experience.querySelector('.card:nth-child(1) h3').textContent = content.experience.healthcare.title;
        experience.querySelector('.card:nth-child(1) p').textContent = content.experience.healthcare.description;
        experience.querySelector('.card:nth-child(2) h3').textContent = content.experience.developer.title;
        experience.querySelector('.card:nth-child(2) p').textContent = content.experience.developer.description;
        
        // Update contact section
        contact.querySelector('h2').textContent = content.contact.title;
        contact.querySelector('.card > p').textContent = content.contact.message;
        
        // Update button states
        languageButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update text direction for Arabic
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });
}

// Event delegation for language buttons
document.querySelector('.language-switcher').addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn) {
        const lang = btn.dataset.lang;
        updateContent(lang);
    }
});

// Initialize with default language
updateContent('en');
