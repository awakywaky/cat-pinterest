new Vue({
    el: "#app",
    data: {
        activeTab: "all",
        cats: [],
        favoriteCats: JSON.parse(localStorage.getItem("favorites")) || [],
        hoveredCat: null,
        apiKey:
            "live_pi0uTtgRppocB0Ozyk8e1LFB3qGtFyJCIWKTLlFjq7sarq8PFkRTwp0H2e0splyr",
        page: 0,
        isLoading: false,
    },
    methods: {
        async loadCats() {
            if (this.isLoading) return;
            this.isLoading = true;
            try {
                const response = await fetch(
                    `https://api.thecatapi.com/v1/images/search?limit=15&page=${this.page}&api_key=${this.apiKey}`
                );
                const data = await response.json();
                this.cats.push(...data);
                this.page++;
            } catch (error) {
                console.error("Ошибка загрузки котиков:", error);
            } finally {
                this.isLoading = false;
            }
        },
        handleScroll() {
            const main = this.$refs.main;
            if (
                main.scrollTop + main.clientHeight >= main.scrollHeight - 100 &&
                !this.isLoading
            ) {
                this.loadCats();
            }
        },
        toggleFavorite(cat) {
            const index = this.favoriteCats.findIndex((fav) => fav.id === cat.id);
            if (index === -1) {
                this.favoriteCats.push(cat);
            } else {
                this.favoriteCats.splice(index, 1);
            }
            localStorage.setItem("favorites", JSON.stringify(this.favoriteCats));
        },
        isFavorite(cat) {
            return this.favoriteCats.some((fav) => fav.id === cat.id);
        },
    },
    mounted() {
        this.loadCats();
        window.addEventListener("scroll", this.handleScroll);
        this.$refs.main.addEventListener("scroll", this.handleScroll);

        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) {
            this.activeTab = savedTab;
        }
    },
    watch: {
        activeTab(newTab) {
            localStorage.setItem("activeTab", newTab);
        },
    },
});
