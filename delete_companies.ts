const LOCAL_STORAGE_KEY = "companies_3n-AXlJ_QAGOOU1qn1xjc";

class AssertionError extends Error {
  override readonly name = "AssertionError" as const;
}

function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new AssertionError(msg);
}

function getJobsParentElement(): HTMLUListElement {
  const parentEl = document.querySelector<HTMLUListElement>(
    "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__list > div > ul",
  );
  assert(parentEl, "Jobs parent element not found");
  return parentEl;
}

function getJobs(): HTMLLIElement[] {
  const parentEl = getJobsParentElement();
  // const jobs = parentEl?.getElementsByClassName(
  //   "ember-view   jobs-search-results__list-item occludable-update p0 relative scaffold-layout__list-item",
  // );
  const jobs = parentEl.querySelectorAll<HTMLLIElement>(
    ":scope > li[data-occludable-job-id]",
  );
  return jobs ? [...jobs] : [];
}

function getCompanyFromJob(job: HTMLElement): HTMLSpanElement | null {
  return job.querySelector<HTMLSpanElement>(
    ":scope span.job-card-container__primary-description",
  );
}

function removeJobs(companies: Set<string>): void {
  for (const job of getJobs()) {
    const companyText = getCompanyFromJob(job)?.textContent?.trim();
    if (companyText && companies.has(companyText)) job.remove();
  }
}

function removeCompanyJobs(companies: Set<string>, job: HTMLElement): void {
  const companyText = getCompanyFromJob(job)?.textContent?.trim();
  if (companyText) {
    const acceptance = window.confirm(
      `Are you sure you want to remove "${companyText}"?`,
    );
    if (acceptance) {
      companies.add(companyText);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([...companies].sort()),
      );
      removeJobs(companies);
    }
  }
}

function watchCompanies(companies: Set<string>): void {
  removeJobs(companies);
  getJobsParentElement().addEventListener("wheel", () => {
    console.log("scrolling"); // IMPORTANT!
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

// https://www.linkedin.com/voyager/api/graphql?queryId
function main() {
  const companies = new Set<string>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]"),
  );

  setTimeout(() => watchCompanies(companies), 3000);
}

main();
