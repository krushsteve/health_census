const addPatientButton = document.querySelector('#addPatient');
const report = document.querySelector('#report');
const btnSearch = document.querySelector('#btnSearch');
const patients = [];

function addPatient() {
    const name = document.querySelector('#name').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.querySelector('#age').value;
    const condition = document.querySelector('#condition').value;

    if (name && gender && age && condition) {
        patients.push({ name, gender: gender.value, age, condition });
        resetForm();
        generateReport();
      }
}

function resetForm() {
    document.querySelector('#name').value = '';
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.querySelector('#age').value = '';
    document.querySelector('#condition').value = '';
}

function searchCondition() {
    const input = document.querySelector('#conditionInput').value.toLowerCase();
    const resultDiv = document.querySelector('#result');
    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
      .then(response => response.json())
      .then(data => {
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);

        if (condition) {
          const symptoms = condition.symptoms.join(', ');
          const prevention = condition.prevention.join(', ');
          const treatment = condition.treatment;

          resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
          resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;
          resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
          resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
          resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
            resultDiv.innerHTML += 'Condition not found';
        }
      })
      .catch (error => {
        console.error('Error:', error);
        resultDiv.innerHTML += 'An error occurred while fetching data';
      });
}
btnSearch.addEventListener('click', searchCondition);

function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };
    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
    };

    for (const patient of patients) {
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`;
    for (const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += `<br>Gender-based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }
}

addPatientButton.addEventListener('click', addPatient);