document.addEventListener("DOMContentLoaded", () => {
	const search_input = document.getElementById("blog-search-input")
	const search_btn = document.getElementById("blog-search-btn")
	const search_results = document.getElementById("search-results")
	const blog_items = document.querySelectorAll(".blog-item")

	let current_term = ""
	let current_results = Array.from(blog_items)

	const tag_buttons = document.querySelectorAll(".tech-tags .tag")
	const active_tags = new Set()

	const does_pots_match_search = (post, term) => {
		const title = post.querySelector("h2").textContent.toLocaleLowerCase()
		const excerpt = post.querySelector(".excerpt").textContent.toLocaleLowerCase()

		return title.includes(term) || excerpt.includes(term)
	}

	const update_visibility = () => {
		current_results = current_results.filter(post => {
			const post_tags = post.dataset.tags?.split(",").map(tag => tag.trim().toLowerCase()) || []
			const matches_tags = active_tags.size === 0 ? true : !post_tags.some(t => !active_tags.has(t))

			return matches_tags
		})

		display_search_results(current_results, current_term)
	}

	const perform_search = () => {
		current_term = search_input.value.toLowerCase().trim()

		if (current_term === "") {
			search_results.innerHTML = ""
			document.querySelector(".blog-list").style.display = "block"
			return
		}

		const results = Array.from(blog_items).filter(post => does_pots_match_search(post, current_term))

		current_results = Array.from(results).filter(post => {
			const post_tags = post.dataset.tags?.split(",").map(tag => tag.trim().toLowerCase())
			const matches_tags = active_tags.size === 0 ? true : !post_tags.some(t => !active_tags.has(t))

			return matches_tags
		})

		display_search_results(current_results, current_term)
	}

	const display_search_results = (results, term) => {
		const results_length = results.length
		document.querySelector(".blog-list").style.display = "none"

		if (results_length === 0) {
			const active_tags_string = Array.from(active_tags).join(", ")
			console.log(active_tags_string)
			search_results.innerHTML = `<p> No results found for "${term}" and ${active_tags_string} tags</p>`
			return
		}

		search_results.innerHTML = `<p> Found ${results_length} results for ${term} </p>`

		const results_list = document.createElement("div")
		results_list.className = "search-results-list"

		results.forEach(post => {
			results_list.appendChild(post.cloneNode(true))
		})

		search_results.appendChild(results_list)
	}

	search_btn.addEventListener("click", perform_search)
	search_input.addEventListener("keyup", e => {
		if (e.key === "Enter")
			perform_search()
	})

	tag_buttons.forEach(btn => {
		btn.addEventListener("click", () => {
			const tag = btn.dataset.tag

			if (active_tags.has(tag)) {
				active_tags.delete(tag)
				btn.classList.remove("active")
			} else {
				active_tags.add(tag)
				btn.classList.add("active")
			}

			update_visibility(current_results)
		})
	})
})