const LOCAL_STORAGE_KEY = "companies_3n-AXlJ_QAGOOU1qn1xjc";
class AssertionError extends Error {
    name = "AssertionError";
}
function assert(expr, msg) {
    if (!expr)
        throw new AssertionError(msg);
}
function getJobsParentElement() {
    const parentEl = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__list > div > ul");
    assert(parentEl, "Jobs parent element not found");
    return parentEl;
}
function getJobs() {
    const parentEl = getJobsParentElement();
    const jobs = parentEl.querySelectorAll(":scope > li[data-occludable-job-id]");
    return jobs ? [...jobs] : [];
}
function getCompanyFromJob(job) {
    return job.querySelector(":scope span.job-card-container__primary-description");
}
function removeJobs(companies) {
    for (const job of getJobs()) {
        const companyText = getCompanyFromJob(job)?.textContent?.trim();
        if (companyText && companies.has(companyText))
            job.remove();
    }
}
function removeCompanyJobs(companies, job) {
    const companyText = getCompanyFromJob(job)?.textContent?.trim();
    if (companyText) {
        const acceptance = window.confirm(`Are you sure you want to remove "${companyText}"?`);
        if (acceptance) {
            companies.add(companyText);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...companies].sort()));
            removeJobs(companies);
        }
    }
}
function watchCompanies(companies) {
    removeJobs(companies);
    getJobsParentElement().addEventListener("wheel", () => {
        console.log("scrolling");
        removeJobs(companies);
    });
    for (const job of getJobs()) {
        const button = document.createElement("button");
        button.type = "button";
        button.className =
            "artdeco-pill artdeco-pill--slate artdeco-pill--choice artdeco-pill--2 search-reusables__filter-pill-button artdeco-pill--selected reusable-search-filter-trigger-and-dropdown__trigger";
        button.id = "searchFilter_workplaceType";
        button.setAttribute("aria-controls", "artdeco-hoverable-artdeco-gen-43");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Remove Company");
        button.textContent = "Remove Company";
        button.addEventListener("click", () => removeCompanyJobs(companies, job));
        const div = document.createElement("div");
        div.style.margin = "20px";
        div.appendChild(button);
        job.appendChild(div);
    }
}
function main() {
    const companies = new Set(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]"));
    setTimeout(() => watchCompanies(companies), 3000);
}
main();
export {};
