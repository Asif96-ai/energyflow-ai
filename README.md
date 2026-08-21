# EnergyFlow AI

### AI-Assisted Energy Monitoring, Simulation & Electrical Intelligence

EnergyFlow AI is a web-based energy intelligence platform that combines
electrical engineering concepts, renewable-energy analysis, battery
storage simulation, grid-dependency analysis, and AI-assisted
recommendations in an interactive dashboard.

The project demonstrates how electrical engineering knowledge can be
combined with modern software development and local AI-style
decision-support logic to create an interactive energy-management
prototype.

The project focuses on the intersection of:

**Electrical Engineering + Renewable Energy + Battery Storage + Software Development + AI**

## Live Demo

**Live Application:**  
[Open EnergyFlow AI]( https://energyflow-ai.vercel.app/)

**GitHub Repository:**  
https://github.com/Asif96-ai/energyflow-ai


# Project Overview

EnergyFlow AI simulates a small electrical energy system consisting of:

- Electrical loads
- Solar photovoltaic generation
- Battery energy storage
- Electrical grid
- Energy consumption
- Renewable-energy utilization

The application allows users to:

- Monitor electrical-system conditions
- Adjust simulated energy inputs
- Analyze solar generation
- Monitor battery state of charge
- Evaluate grid dependency
- Perform What-If energy simulations
- Receive engineering-oriented recommendations
- Understand electrical parameters through an interactive dashboard

The project was developed as a portfolio application combining
electrical engineering with modern web development and AI-assisted
energy analysis.

# Key Features

## Energy Monitoring Dashboard

The main dashboard provides an overview of the simulated energy system.

It displays:

- Active Power
- Voltage
- Current
- Power Factor
- Solar Generation
- Battery State of Charge
- Grid Import
- Grid Export
- Solar Coverage
- Solar Surplus
- Solar Deficit
- Renewable Utilization
- Estimated Energy Cost
- Estimated CO₂ Impact
- Overall System Status

The values are calculated dynamically from the selected electrical
loads, solar generation, battery state, and configured electrical
parameters.

# Understanding the Energy Values

EnergyFlow AI is designed so that users can understand what each
dashboard value represents rather than simply seeing unexplained
numbers.

## Active Power

Active Power represents the electrical power currently consumed by
the selected active devices.

It is displayed in watts (W) and internally converted to kilowatts (kW).

##Battery State of Charge (SoC)
Battery SoC = Stored Energy Availability
Battery State of Charge (SoC) represents the percentage of available
battery energy currently stored in the battery.
0% SoC   = 0 kWh
25% SoC  = 5 kWh
50% SoC  = 10 kWh
75% SoC  = 15 kWh
100% SoC = 20 kWh
Battery Maximum Power = 5 kW
This limits the battery's instantaneous charging or discharging power.
This means the battery can contain a certain amount of stored energy
while its instantaneous charge/discharge power is still limited.

## Solar Generation

Solar Generation represents the simulated photovoltaic (PV) power
available to the energy system.
It is measured in: kW
The solar generation value is compared with the electrical load to
determine solar coverage, surplus, deficit, and grid dependency.
##Solar Coverage
Solar Coverage represents how much of the current electrical load can
be covered by available solar generation.

## Solar Surplus

Solar Surplus occurs when: Solar Generation > Electrical Load
The surplus represents renewable generation that exceeds the immediate
electrical load.
Depending on system conditions, this energy may be available for:
•	Battery charging 
•	Flexible loads 
•	Grid export

## Solar Deficit

Solar Deficit occurs when: Electrical Load > Solar Generation
The remaining demand must then be supported by battery discharge and/or
grid import depending on the simulated battery condition.

## Grid Import

Grid Import represents electrical power supplied by the electrical
grid when the local solar and battery resources are not sufficient to
meet the current load.
The simplified relationship used by the model is:

Grid Import = Load - Solar Generation - Battery Discharge

## Grid Export

Grid Export represents excess available energy when local generation
and battery contribution exceed the current electrical load.
Conceptually: Solar + Battery Contribution > Load

## Voltage

The EnergyFlow AI model uses:
Voltage = 230 V
This nominal voltage is used in the electrical calculations for
estimating current and other AC electrical quantities.

## Current

EnergyFlow AI estimates electrical current using: I = P / (V × PF)

## Power Factor

The current model uses: Power Factor = 0.94
Power factor is used in the model to calculate electrical quantities
such as:
•	Current 
•	Apparent Power 
•	Reactive Power 
A lower power factor results in higher apparent current for the same
active power.

## Apparent Power

Apparent Power is calculated using: S = P / PF
This allows the system to distinguish between active power and the
total apparent electrical demand.

## Reactive Power

EnergyFlow AI calculates reactive power from apparent power and active
power.
Conceptually: Reactive Power = √(Apparent Power² - Active Power²) (VAR)
This allows the application to incorporate fundamental AC electrical
engineering concepts into the energy-monitoring model.

## Renewable Utilization

Renewable Utilization represents the proportion of available solar
generation that is directly used by the electrical load.

## Energy Cost

EnergyFlow AI uses the following configured electricity price: Electricity Price = €0.32 / kWh
The application estimates the hourly cost associated with grid import.

## Estimated CO₂ Impact

The current model uses:
Grid Emission Factor = 0.4 kg CO₂/kWh
This value is used to estimate emissions associated with grid import.
The value is an estimate based on the configured emission factor and
should not be interpreted as a real-time measurement of the local
electricity grid's actual carbon intensity.

## Grid Dependency

Grid dependency represents how much electrical power the system still
requires from the external electrical grid after considering local
solar generation and battery support.

## What-If Energy Simulator

The What-If Energy Simulator is designed to answer questions such as:
•	What would happen to grid dependency if solar generation increased?
or
•	What would happen if more battery energy were available?

# AI Energy Intelligence

EnergyFlow AI includes a local decision-support layer that evaluates
energy-system conditions and generates engineering-oriented
recommendations.
The recommendation logic considers factors including:
•	Electrical load 
•	Solar generation 
•	Battery SoC 
•	Grid dependency 
•	Solar surplus 
•	Solar deficit 
•	Renewable utilization 
•	Power factor 
•	Estimated energy cost 
•	Estimated CO₂ impact 
•	The goal is to convert numerical energy-system conditions into
understandable engineering recommendations.

# AI Energy Advisor

The AI Energy Advisor analyzes the current simulated energy-system
conditions and provides recommendations related to:
•	Energy efficiency 
•	Renewable-energy utilization 
•	Battery management 
•	Grid dependency 
•	Solar surplus 
•	Solar deficit 
•	Power factor 
•	Energy cost 
•	CO₂ impact 
The system is designed as a local, explainable decision-support
feature and does not require a paid external LLM API for its core
functionality.

# AI Copilot

The AI Copilot provides an interactive interface for understanding
the current energy-system state.
It can help interpret questions related to:
•	Current electrical demand 
•	Solar generation 
•	Battery availability 
•	Grid dependency 
•	Renewable utilization 
•	Energy efficiency 
•	Power factor 
•	Simulation results 
The objective is to make the energy-system calculations easier to
understand while maintaining an engineering-oriented approach.

# Application Screenshots

## Main Energy Dashboard

![EnergyFlow AI Dashboard](https://raw.githubusercontent.com/Asif96-ai/energyflow-ai/main/docs/dashboard.png)
The main dashboard provides an overview of electrical load, solar
generation, battery state of charge, grid dependency, voltage,
current, power factor, and overall energy performance.

## What-If Energy Simulator

![What-If Energy Simulator](https://raw.githubusercontent.com/Asif96-ai/energyflow-ai/main/docs/what-if.png)
The What-If Energy Simulator allows users to test hypothetical solar
and battery scenarios without changing the current operating state.
The simulator compares the current system against a hypothetical
system and reports grid impact, grid reduction, and percentage
improvement.

## AI Energy Advisor

![AI Energy Advisor](https://raw.githubusercontent.com/Asif96-ai/energyflow-ai/main/docs/energy-advisor.png)
The AI Energy Advisor analyzes the current energy-system conditions
and provides engineering-oriented recommendations for improving
energy efficiency, renewable utilization, battery management,
power factor, and grid dependency.

## AI Copilot

![AI Copilot](https://raw.githubusercontent.com/Asif96-ai/energyflow-ai/main/docs/ai-copilot.png)
The AI Copilot provides an interactive interface for interpreting
energy-system conditions and understanding the effect of different
energy scenarios.

# Electrical Engineering Concepts

The project incorporates practical electrical engineering concepts
including:
•	Active power 
•	Apparent power 
•	Reactive power 
•	Power factor 
•	AC current estimation 
•	Nominal voltage 
•	Photovoltaic generation 
•	Solar surplus and deficit 
•	Battery state of charge 
•	Battery charge/discharge power limits 
•	Grid import and export 
•	Renewable-energy utilization 
•	Grid dependency 
•	Energy cost estimation 
•	Grid-related CO₂ estimation 
This allows EnergyFlow AI to demonstrate the combination of
electrical engineering knowledge with software engineering and
AI-assisted energy analysis.

# Technology Stack

## Frontend

•	React 
•	Vite 
•	JavaScript 
•	HTML5 
•	CSS 

## Energy Simulation

•	JavaScript-based local energy simulation engine 
•	Electrical power calculations 
•	Solar-energy calculations 
•	Battery-storage modelling 
•	Grid import/export calculations 
•	Energy cost estimation 
•	CO₂ estimation 

## AI / Decision Support

•	Local rule-based energy intelligence 
•	AI Energy Advisor 
•	AI Copilot 
•	Scenario-based recommendations 
•	No paid external LLM API required for the core system 

## Development & Deployment

•	Visual Studio Code 
•	Git 
•	GitHub 
•	Vercel
# Design Goals

## 1. Engineering Accuracy

The application incorporates fundamental electrical engineering
relationships instead of treating energy as a generic numerical
dataset.

## 2. Explainability

Simulation results are presented with numerical comparisons,
formulas, examples, and engineering-oriented explanations.

## 3. Accessibility

Complex energy-system concepts are presented through an interactive
dashboard rather than requiring users to inspect raw calculations.

## 4. Local AI Decision Support

The core energy-analysis and recommendation features operate locally
without requiring a paid external LLM API.

## 5. Practical Software Development

The project demonstrates:
•	Component-based React development 
•	Interactive user interfaces 
•	State management 
•	Energy-system simulation 
•	Electrical calculations 
•	Scenario analysis 
•	Data visualization 
•	Git/GitHub workflow 
•	Production deployment with Vercel

# Limitations

EnergyFlow AI is currently a simulation and portfolio project rather
than a certified energy-management, protection, or grid-control system.
The application uses configurable assumptions for parameters such as:
•	Nominal voltage 
•	Power factor 
•	Battery capacity 
•	Battery power limit 
•	Electricity price 
•	Grid emission factor 
The calculated values should therefore be interpreted as simulation
results rather than measurements from certified electrical equipment.
For real-world deployment, the system would require:
•	Validated sensor data 
•	Smart-meter or IoT integration 
•	More detailed electrical-system models 
•	Secure data handling 
•	Hardware integration 
•	Domain-specific validation 
•	Appropriate safety and grid-compliance considerations

# Future Development

## Potential future extensions include:

•	Real-time smart-meter integration 
•	IoT energy-meter connectivity 
•	Historical energy-data storage 
•	Time-series energy forecasting 
•	Photovoltaic production forecasting 
•	Weather-aware renewable-energy forecasting 
•	Battery charge/discharge optimization 
•	Dynamic electricity-price integration 
•	Advanced energy anomaly detection 
•	Energy consumption forecasting 
•	Backend-based analytics 
•	User accounts and persistent energy data 
•	Real-time monitoring of distributed energy resources 
•	Optional integration with external LLM services

# Installation

Clone the repository:
git clone https://github.com/Asif96-ai/energyflow-ai.git
Navigate into the project:
•	cd energyflow-ai
Install dependencies:
•	npm install
Start the development server:
•	npm run dev
The application can then be opened using the local development URL
provided by Vite.

# Production Build

To create a production build:
•	npm run build
The production application is deployed through Vercel.

# Development Workflow

The project uses Git and GitHub for version control.
Typical workflow:
•	git status
•	git add .
•	git commit -m "Update EnergyFlow AI"
•	git push origin main

The main branch represents the current portfolio-ready version of
the project.

## Author

# Muhammad Asif
# Electrical Engineer | Energy Systems | AI & Software Development

EnergyFlow AI was developed as a portfolio project combining
electrical engineering knowledge with modern web development,
renewable-energy simulation, battery-storage modelling, and
AI-assisted energy intelligence.
The project demonstrates practical application of:
•	Electrical power engineering 
•	Renewable-energy systems 
•	Battery energy storage 
•	Energy-system simulation 
•	Electrical calculations 
•	Scenario analysis 
•	React development 
•	JavaScript 
•	Interactive dashboards 
•	AI-assisted decision support 
•	Git/GitHub development workflow 
•	Cloud deployment 

GitHub
https://github.com/Asif96-ai
Project Repository
https://github.com/Asif96-ai/energyflow-ai

# License

EnergyFlow AI is released under the MIT License.
Copyright (c) 2026 Muhammad Asif
See the ( https://github.com/Asif96-ai/energyflow-ai/blob/main/LICENSE) file for the complete license terms.
