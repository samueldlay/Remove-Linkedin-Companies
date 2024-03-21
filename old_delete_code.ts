const parentEl = document.querySelector("#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__list > div > ul");

const companies = [];

function deleteCompany(parentList, companies) {
  const jobsList = parentList?.getElementsByClassName("ember-view   jobs-search-results__list-item occludable-update p0 relative scaffold-layout__list-item");
  console.log({ jobsList });

  if (jobsList) {
    const jobsListCopy = Array.from(jobsList);
    const jobsToRemove = jobsListCopy.filter((job) => {
      const companyEl = job.querySelector("span.job-card-container__primary-description")
      const companyText = companyEl ? companyEl.textContent?.trim() : "";
      return companyText && companies.includes(companyText?.trim());
    });
    // for (const job of jobsList) {
    //   const companyEl = job.querySelector("span.job-card-container__primary-description")
    //  const companyText = companyEl ? companyEl.textContent?.trim() : "";
    //   console.log({ companyText })
    //   if (companyText?.trim() && companies.includes(companyText?.trim())) {
    //     console.log("removing", companyText);
    //     job.remove();
    //   }
    //   else {
    //     console.log("keeping", companyText);
    //   }
    // }
    for (const job of jobsToRemove) {
      job.remove();
    }
  }
}

function openPrompt() {
  const promptList = prompt("Add companies separated by a comma");
  if (promptList) companies.push(promptList);
  deleteCompany(parentEl, companies);
}
