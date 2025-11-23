/**
 * Blog search and filter module.
 * Handles searching blog posts by text and filtering by tags.
 * Dispatches custom events to notify pagination when content changes.
 */
document.addEventListener("DOMContentLoaded", () => {
	// DOM elements
	const search_input = document.getElementById("blog-search-input")
	const search_btn = document.getElementById("blog-search-btn")
	const search_results = document.getElementById("search-results")
	const blog_items = document.querySelectorAll(".blog-item")

	// State variables
	let current_term = ""
	let current_results = Array.from(blog_items)

	const tag_buttons = document.querySelectorAll(".blog-filters .tech-tags .tag")
	const active_tags = new Set()

	/**
	 * Dispatches a custom event to notify pagination that content has been updated.
	 */
	const notify_pagination_update = () => {
		document.dispatchEvent(new CustomEvent("blogContentUpdated"))
	}

	/**
	 * Checks if a blog post matches the search term.
	 * @param {HTMLElement} post - The blog post element to check.
	 * @param {string} term - The search term to match against.
	 * @returns {boolean} True if the post title or excerpt contains the search term.
	 */
	const does_pots_match_search = (post, term) => {
		const title = post.querySelector("h2").textContent.toLocaleLowerCase()
		const excerpt = post.querySelector(".excerpt").textContent.toLocaleLowerCase()

		return title.includes(term) || excerpt.includes(term)
	}

	/**
	 * Filters current results based on active tag selections.
	 * Only shows posts that have ALL active tags.
	 */
	const filter_by_tags = () => {
		current_results = current_results.filter(post => {
			const post_tags = post.dataset.tags?.split(",").map(tag => tag.trim().toLowerCase()) || []
			const matches_tags = active_tags.size === 0 ? true : !post_tags.some(t => !active_tags.has(t))

			return matches_tags
		})
	}

	/**
	 * Performs a search based on the input value.
	 * Filters posts by search term and active tags, then displays results.
	 */
	const perform_search = () => {
		current_term = search_input.value.toLowerCase().trim()

		// If search is empty, clear results and show all posts
		if (current_term === "") {
			search_results.innerHTML = ""
			document.querySelector(".blog-list").style.display = "block"
			return
		}

		// Filter posts by search term
		current_results = Array.from(blog_items).filter(post => does_pots_match_search(post, current_term))

		filter_by_tags()
		display_search_results()
	}

	/**
	 * Displays search results in the search results container.
	 */
	const display_search_results = () => {
		const results_length = current_results.length
		document.querySelector(".blog-list").style.display = "none"

		if (results_length === 0) {
			const active_tags_string = Array.from(active_tags).join(", ")
			console.log(active_tags_string)
			search_results.innerHTML = `<p> No results found for "${current_term}" ${active_tags_string ? " and" + active_tags_string : ""} tags</p>`
			return
		}

		search_results.innerHTML = `<p> Found ${results_length} results for "${current_term}" </p>`

		const results_list = document.createElement("div")
		results_list.className = "search-results-list"

		current_results.forEach(post => {
			results_list.appendChild(post.cloneNode(true))
		})

		console.log(results_list.innerHTML)

		search_results.appendChild(results_list)

		notify_pagination_update()
	}

	// Event listeners
	search_btn.addEventListener("click", perform_search)
	search_input.addEventListener("keyup", e => {
		if (e.key === "Enter")
			perform_search()
	})

	// Tag filter buttons - toggle active state and update visibility
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

			display_search_results()
		})
	})
})