document.addEventListener("DOMContentLoaded", () => {
	const current_language = localStorage.getItem("language") || "es"

	const translations = {
		en: {
			// Navigation
			"nav-home": "home",
			"nav-blog": "blog",
			"nav-projects": "projects",
			"nav-contact": "contact",

			// Hero section
			"hero-greeting": "Hi, I am",
			"hero-desc": "Some people are born with the answers. I am one of the people who is driven to find them. My work is defined by a relentless effort to dig deeper, ask the right questions, and not stop until I have discovered the best possible solution. I just want to build cool stuff.",

			// Projects section
			"projects-title": "Projects",
			"portfolio-title": "Portfolio",
			"portfolio-desc": "Website showcasing my projects and skills.",
			"project-code": "Code",
			"project-live": "Live",

			// Contact section
			"contact-title": "Contact",
			"contact-name": "Name",
			"contact-email": "Email",
			"contact-message": "Message",
			"contact-send": "Send",

			// Footer
			"footer": "Created by Brandon"
		},
		es: {
			// Navigation
			"nav-home": "inicio",
			"nav-blog": "blog",
			"nav-projects": "proyectos",
			"nav-contact": "contactos",

			// Hero section
			"hero-greeting": "Hola, soy",
			"hero-desc": "Algunas personas nacen con las respuestas. Yo soy una de las personas que se esfuerza por encontrarlas. Mi trabajo se define por un esfuerzo incansable para profundizar, hacer las preguntas correctas y no detenerme hasta que haya descubierto la mejor solución posible. Solo quiero construir cosas geniales.",

			// Projects section
			"projects-title": "Proyectos",
			"portfolio-title": "Portafolio",
			"portfolio-desc": "Sitio web que muestra mis proyectos y habilidades.",
			"project-code": "Código",
			"project-live": "Demo",

			// Contact section
			"contact-title": "Contacto",
			"contact-name": "Nombre",
			"contact-email": "Correo",
			"contact-message": "Mensaje",
			"contact-send": "Enviar",

			// Footer
			"footer-text": "Creado por Brandon"
		}
	}

	const initialize_language_elements = () => {
		// Navigation
		document.querySelector("a[href='#home'] span").setAttribute("data-lang", "nav-home")
		document.querySelector("a[href='#about'] span").setAttribute("data-lang", "nav-about")
		document.querySelector("a[href='#projects'] span").setAttribute("data-lang", "nav-projects")
		document.querySelector("a[href='#contact'] span").setAttribute("data-lang", "nav-contact")

		// Hero section
		document.querySelector(".hero-section .typewriter div span").setAttribute("data-lang", "hero-greeting")
		document.querySelector(".hero-section .text > p").setAttribute("data-lang", "hero-desc")

		// Project section
		document.querySelector(".projects-section h2").setAttribute("data-lang", "projects-title")
		document.querySelector("#portfolio .project-info h3").setAttribute("data-lang", "portfolio-title")
		document.querySelector("#portfolio .project-info p").setAttribute("data-lang", "portfolio-desc")

		document.querySelectorAll(".project-links a").forEach(link => {
			const link_text = link.textContent

			if (link_text.includes("Code")) {
				const target_element = link.querySelector("span") || link
				target_element.setAttribute("data-lang", "project-code")
			} else if (link_text.includes("Live")) {
				const target_element = link.querySelector("span") || link
				target_element.setAttribute("data-lang", "project-live")
			}
		})

		// Contact section
		document.querySelector(".contact-section h2").setAttribute("data-lang", "contact-title")
		document.querySelector("label[for='name']").setAttribute("data-lang", "contact-name")
		document.querySelector("label[for='email']").setAttribute("data-lang", "contact-email")
		document.querySelector("label[for='message']").setAttribute("data-lang", "contact-message")
		document.querySelector(".contact-section form button").setAttribute("data-lang", "contact-send")

		// Footer
		document.querySelector("footer p").setAttribute("data-lang", "footer-text")
	}

	const set_language = (lang) => {
		document.querySelectorAll("[data-lang]").forEach(e => {
			const key = e.getAttribute("data-lang")
			if (translations[lang][key])
				e.textContent = translations[lang][key]
		})
		document.getElementById("current-lang").textContent = lang.toUpperCase()
		localStorage.setItem("language", lang)
	}

	const toggle_language = () => {
		const current_lang = localStorage.getItem("language") || "en"
		const new_lang = current_lang === "en" ? "es" : "en"
		set_language(new_lang)
	}

	initialize_language_elements();
	set_language(current_language)

	document.getElementById("language-btn").addEventListener("click", toggle_language)
})
