const formatPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
});

function addParagraph(container, text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    container.append(paragraph);
}

function showLoadError() {
    const generalPrices = document.querySelector("#tarifs-generaux");
    const schedule = document.querySelector("#horaires");
    addParagraph(generalPrices, "Les informations ne sont pas disponibles pour le moment.");
    addParagraph(schedule, "Les horaires ne sont pas disponibles pour le moment.");
}

fetch("tarifs-horaires.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Impossible de charger les tarifs et horaires.");
        }
        return response.json();
    })
    .then((data) => {
        const generalPrices = document.querySelector("#tarifs-generaux");
        data.tarifs.prestations.forEach((item) => {
            addParagraph(generalPrices, `${item.prestation} : ${formatPrice.format(item.prix)}`);
        });

        document.querySelectorAll("[data-tarifs-femmes]").forEach((container) => {
            const category = data.tarifs.femmes.find(
                (item) => item.longueur === container.dataset.tarifsFemmes
            );
            category?.prestations.forEach((item) => {
                addParagraph(container, `${item.prestation} : ${formatPrice.format(item.prix)}`);
            });
        });

        const weddingPrices = document.querySelector("#tarifs-mariage");
        data.tarifs.mariage.forEach((item) => {
            addParagraph(weddingPrices, `${item.prestation} : ${formatPrice.format(item.prix)}`);
        });

        const schedule = document.querySelector("#horaires");
        const days = document.createElement("div");
        const times = document.createElement("div");
        days.className = "jour";
        times.className = "heure";

        data.horaires.forEach((item) => {
            const label = item.ouvert === false
                ? "Fermé"
                : item.ouvert === null
                    ? "Non renseigné"
                    : `${item.ouverture} - ${item.fermeture}`;
            addParagraph(days, item.jour);
            addParagraph(times, label);
        });

        schedule.append(days, times);
    })
    .catch(showLoadError);