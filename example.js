document.addEventListener("DOMContentLoaded", async () => {
    const districtSelect = document.getElementById("districts");
    const constituencySelect = document.getElementById("constituencies");
    const subCountySelect = document.getElementById("subcounties");
    const electoralAreaSelect = document.getElementById("electoral-areas");
    const resultsDiv = document.getElementById("results");

    const selector = new UgandaLocationSelector();

    try {
        await selector.init();

        // Populate districts
        const districts = selector.getDistricts();
        districtSelect.innerHTML = "<option>Select a district</option>";
        districts.forEach(d => {
            const option = document.createElement("option");
            option.value = d.code;
            option.textContent = d.name;
            districtSelect.appendChild(option);
        });
        districtSelect.disabled = false;

        // District change event
        districtSelect.addEventListener("change", () => {
            const selectedDistrict = districtSelect.value;
            constituencySelect.innerHTML = "<option>Select a constituency</option>";
            subCountySelect.innerHTML = "<option>Select a constituency first</option>";
            electoralAreaSelect.innerHTML = "<option>Select a sub-county first</option>";
            constituencySelect.disabled = true;
            subCountySelect.disabled = true;
            electoralAreaSelect.disabled = true;
            resultsDiv.innerHTML = "";

            if (selectedDistrict) {
                const constituencies = selector.getConstituencies(selectedDistrict);
                if (constituencies) {
                    constituencies.forEach(c => {
                        const option = document.createElement("option");
                        option.value = c.code;
                        option.textContent = c.name;
                        constituencySelect.appendChild(option);
                    });
                    constituencySelect.disabled = false;
                }
            }
        });

        // Constituency change event
        constituencySelect.addEventListener("change", () => {
            const selectedDistrict = districtSelect.value;
            const selectedConstituency = constituencySelect.value;
            subCountySelect.innerHTML = "<option>Select a sub-county</option>";
            electoralAreaSelect.innerHTML = "<option>Select a sub-county first</option>";
            subCountySelect.disabled = true;
            electoralAreaSelect.disabled = true;
            resultsDiv.innerHTML = "";

            if (selectedDistrict && selectedConstituency) {
                const subCounties = selector.getSubCounties(selectedDistrict, selectedConstituency);
                if (subCounties) {
                    subCounties.forEach(s => {
                        const option = document.createElement("option");
                        option.value = s.code;
                        option.textContent = s.name;
                        subCountySelect.appendChild(option);
                    });
                    subCountySelect.disabled = false;
                }
            }
        });

        // Sub-county change event
        subCountySelect.addEventListener("change", () => {
            const selectedDistrict = districtSelect.value;
            const selectedConstituency = constituencySelect.value;
            const selectedSubCounty = subCountySelect.value;
            electoralAreaSelect.innerHTML = "<option>Select an electoral area</option>";
            electoralAreaSelect.disabled = true;
            resultsDiv.innerHTML = "";

            if (selectedDistrict && selectedConstituency && selectedSubCounty) {
                const electoralAreas = selector.getElectoralAreas(selectedDistrict, selectedConstituency, selectedSubCounty);
                if (electoralAreas) {
                    electoralAreas.forEach(e => {
                        const option = document.createElement("option");
                        option.value = e.code;
                        option.textContent = e.name;
                        electoralAreaSelect.appendChild(option);
                    });
                    electoralAreaSelect.disabled = false;
                }
            }
        });

        // Electoral area change event
        electoralAreaSelect.addEventListener("change", async () => {
            const selectedDistrictName = districtSelect.options[districtSelect.selectedIndex].text;
            const selectedElectoralAreaName = electoralAreaSelect.options[electoralAreaSelect.selectedIndex].text;
            resultsDiv.innerHTML = "Fetching coordinates...";

            const query = `${selectedElectoralAreaName}, ${selectedDistrictName}, Uganda`;
            const coordinates = await selector.getCoordinates(query);

            if (coordinates) {
                resultsDiv.innerHTML = `
                    <h3>${coordinates.display_name}</h3>
                    <p>Latitude: ${coordinates.lat}</p>
                    <p>Longitude: ${coordinates.lon}</p>
                `;
            } else {
                resultsDiv.innerHTML = "Could not find coordinates for the selected location.";
            }
        });

    } catch (error) {
        districtSelect.innerHTML = "<option>Error loading data</option>";
        console.error("Failed to initialize location selector:", error);
    }
});

