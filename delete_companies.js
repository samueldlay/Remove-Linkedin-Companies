const div = document.createElement("div");
const removeButton = `<button class="artdeco-pill artdeco-pill--slate artdeco-pill--choice artdeco-pill--2 search-reusables__filter-pill-button
    artdeco-pill--selected reusable-search-filter-trigger-and-dropdown__trigger" id="searchFilter_workplaceType" aria-controls="artdeco-hoverable-artdeco-gen-43" aria-expanded="false" aria-label="Remove Company" type="button">
Remove Company    
</button>`;
div.innerHTML = removeButton;
div.style.margin = "20px 20px 20px 20px";
const companies = localStorage.getItem("companies") ? JSON.parse(localStorage.getItem("companies")) : [];
function deleteCompany() {
    const parentEl = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__list > div > ul");
    const jobs = parentEl?.getElementsByClassName("ember-view   jobs-search-results__list-item occludable-update p0 relative scaffold-layout__list-item");
    if (jobs) {
        const jobsListCopy = Array.from(jobs);
        const jobsToRemove = jobsListCopy.filter((job) => {
            const companyEl = job.querySelector("span.job-card-container__primary-description");
            const companyText = companyEl ? companyEl.textContent?.trim() : "";
            return companyText && companies.includes(companyText?.trim());
        });
        for (const job of jobsToRemove) {
            job.remove();
        }
    }
}
function watchCompanies() {
    deleteCompany();
    const parentEl = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__list > div > ul");
    const jobs = parentEl?.getElementsByClassName("ember-view   jobs-search-results__list-item occludable-update p0 relative scaffold-layout__list-item");
    parentEl?.addEventListener("wheel", () => {
        console.log("scrolling");
        deleteCompany();
    });
    if (jobs) {
        for (const job of jobs) {
            const divCopy = div.cloneNode(true);
            divCopy.addEventListener("click", () => {
                const companyEl = job.querySelector("span.job-card-container__primary-description");
                if (companyEl) {
                    const companyText = companyEl.textContent?.trim();
                    if (companyText) {
                        const answer = prompt("Are you sure you want to remove this company? If so, click okay", companyText);
                        if (answer) {
                            console.log("answer: ", answer);
                            companies.push(companyText);
                            localStorage.setItem("companies", JSON.stringify(companies));
                            deleteCompany();
                        }
                    }
                }
            });
            job.appendChild(divCopy);
        }
    }
}
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    watchCompanies();
});
export {};
