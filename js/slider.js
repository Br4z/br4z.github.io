document.addEventListener("DOMContentLoaded", () => {
	const project_cards = document.querySelector(".project-cards")
	const prev_btn = document.querySelector(".prev-btn")
	const next_btn = document.querySelector(".next-btn")
	const slider_dots = document.querySelector(".slider-dots")

	// Get all cards
	const cards = document.querySelectorAll(".project-card")

	// Dynamic values
	let card_width
	let cards_per_view
	let total_slides

	let current_index = 0;
	const slide_to = (index) => {
		if (index < 0)
			index = 0
		else if (index > total_slides - 1)
			index = total_slides - 1

		current_index = index

		const scroll_amount = index * (cards_per_view * card_width)
		project_cards.scrollLeft = scroll_amount

		// Update active dot
		document.querySelectorAll(".dot").forEach((dot, i) => {
			dot.classList.toggle("active", i === current_index)
		})
	}

	const initialize_dots = (dots) => {
		// Clear existing dots
		slider_dots.innerHTML = ""
		for (let i = 0; i < total_slides; i++) {
			const dot = document.createElement("div")
			dot.classList.add("dot")
			if (i === 0)
				dot.classList.add("active")
			// Dot navigation
			dot.addEventListener("click", () => slide_to(i))
			slider_dots.appendChild(dot)
		}
	}

	function setup() {
		if (!cards.length)
			return

		const previous_total_slides = total_slides
		// Create dots base on number of cards that can be shown at once
		card_width = cards[0].offsetWidth + 20 // Including gap
		const container_width = project_cards.offsetWidth
		cards_per_view = Math.max(1, Math.floor(container_width / card_width))
		total_slides = Math.max(1, Math.ceil(cards.length / cards_per_view))

		if (previous_total_slides !== total_slides)
			initialize_dots()
		slide_to(0)
	}

	prev_btn.addEventListener("click", () => {
		slide_to(current_index - 1)
	})

	next_btn.addEventListener("click", () => {
		slide_to(current_index + 1)
	})

	window.addEventListener("load", setup)
	window.addEventListener("resize", setup)
})
