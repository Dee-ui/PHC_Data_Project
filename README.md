# PHC_Data_Project
# PHC-AI Datathon Project

**Description**  
This project builds an AI-assisted system for strengthening Primary Health Care (PHC) in Nigeria (or your chosen country). The system will support:
- Predicting facility patient surge  
- Predicting medicine stock-out risks  
- A triage assistant for symptom inputs  
- Interactive maps and mobile prototype  
- Dashboard for decision makers  

---

## Project Structure

- /data
- /raw ← raw downloaded datasets
- /processed ← cleaned, merged, transformed data
- /backend ← backend API code (FastAPI, models, inference)
- /frontend ← web dashboard (React)
- /mobile ← mobile prototype (React Native / Expo)
- /docs ← design docs, architecture, user stories
- /slides ← final slides, demo script
- README.md ← this file

## Data Sources

- National Health Facility Registry (clinics list)
- Population raster (WorldPop)
- Historic visit counts / facility reports
- (Optional) Stock / supply data

## Team & Roles

- Dauda: ML + models + evaluation
- Emmanuel: data engineering, API, deployment
- Muhammed: geospatial, facility mapping, health logic
- Phenny: frontend + mobile
- Kibe: personas, slide deck, demo script

How to Contribute

- Fork / branch
- Create an issue for your change
- Make changes, commit, push, open a Pull Request
- Assign reviewers and merge when approved
