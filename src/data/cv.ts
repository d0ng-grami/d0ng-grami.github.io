// =============================================================================
// CV data — single source of truth for the /cv page and the generated PDF.
//
// Edit ONLY this file to update both the on-screen CV and the downloadable PDF.
// Section order (screen + PDF):
//   1. Summary
//   2. Education
//   3. Research Experience
//   4. Technical Skills
//   5. Publications & Patent  (grouped by `group` field)
//   6. Honors & Scholarships
//   7. Additional Experience
//
// Replace values as your CV changes; keep the field shapes the same.
// =============================================================================

export interface Profile {
	name: string;
	title: string;
	email: string;
	location: string;
}

export interface EducationEntry {
	school: string;
	degree: string;
	period: string;
	advisor?: string;
	note?: string;
}

export interface ResearchEntry {
	organization: string;
	role: string;
	period: string;
	details: string[];
}

export interface SkillGroup {
	category: string;
	items: string[];
}

// `group` controls which sub-section the entry appears under.
export interface PublicationEntry {
	group:
		| 'International Journal Publications'
		| 'International Conference Presentations'
		| 'Domestic Conference Presentations'
		| 'Patent';
	authors: string;
    title: string;
    venue: string;
    note?: string; // (Oral), (under review) 같은 추가 정보
}

export interface HonorEntry {
	title: string;
	issuer: string;
	year: string;
}

export interface AdditionalEntry {
	organization: string;
	organizationDetail?: string; // 기관명 뒤에 붙는 보조 정보 (e.g. "The University of Tokyo, Japan")
	role: string;                // bold 아닌 역할/직책 첫 줄
	detail?: string;             // 추가 설명 줄
	period: string;
}

export const profile: Profile = {
	name: 'DongWoo Lee',
	title: 'Ph.D. student at The University of Tokyo',
	email: 'dwlee@hybrid.t.u-tokyo.ac.jp',
	location: 'Tokyo, Japan',
};

export const summary: string =
	'Ph.D. student at The University of Tokyo with hands-on experience in MEMS device fabrication, thin-film processing, and microfabrication-based sensor development. Skilled in cleanroom processes, device characterization, and quantitative data analysis, with a strong interest in semiconductor process R&D.';

export const education: EducationEntry[] = [
	{
		school: 'The University of Tokyo',
		degree: 'Doctor of Philosophy in the field of Mechano-informatics',
		period: 'Oct. 2025 – Sep. 2028 (expected)',
		advisor: 'Prof. Shoji Takeuchi',
	},
	{
		school: 'The University of Tokyo',
		degree: 'Master of Information Science and Technology',
		period: 'Oct. 2023 – Sep. 2025',
		advisor: 'Prof. Shoji Takeuchi',
		note: 'Total GPA: 4.0/4.0. Degree Conferral Representative.',
	},
	{
		school: 'Tokyo Institute of Technology',
		degree: 'Bachelor of Engineering, Mechanical Engineering',
		period: 'Apr. 2018 – Sep. 2023',
		advisor: 'Prof. Nobuyuki Iwatsuki',
		note: 'Korea–Japan Joint Government Scholarship Program for the Students in Science and Engineering Departments, 18th Recipient. Total GPA: 85.68/100.00. Early graduation in 3 years 6 months. Military service leave period: Apr. 2020 – Mar. 2022.',
	},
];

export const research: ResearchEntry[] = [
	{
		organization: 'Department of Micro and Nanosystems, KTH Royal Institute of Technology, Sweden',
		role: 'Visiting Ph.D student, PI: Prof. Frank Niklaus',
		period: 'Mar. 2026 – Sep. 2026',
		details: [
			'Project: Liquid-immersed ultrasound sensor using optical read-out.',
			'The research is in the area of liquid-immersed ultrasound sensors using optical read-out schemes. The task is to post-process the silicon photonic chip manufactured and supplied by a silicon photonic foundry, and to develop and implement a measurement setup for characterizing the ultrasound sensor and demonstrating its functionality. The target is to publish the results in a scientific publication.',
		],
	},
	{
		organization: 'Takeuchi – Nie Laboratory, The University of Tokyo',
		role: 'Ph.D Student, PI: Prof. Shoji Takeuchi',
		period: 'Oct. 2025 – Sep. 2028',
		details: [
			'Thesis: PMUT (Piezoelectric micromachined ultrasonic transducer) array for sensing dynamic movements of muscles.',
		],
	},
	{
		organization: 'Takeuchi – Nie Laboratory, The University of Tokyo',
		role: 'Master of Information Science and Technology, PI: Prof. Shoji Takeuchi',
		period: 'Oct. 2023 – Sep. 2025',
		details: [
			'Thesis: A 3D-printed flexible device for measuring concentric contractile force in <i>in vitro</i> smooth muscle tissue model.',
		],
	},
	{
		organization: 'Iwatsuki Laboratory, Tokyo Institute of Technology',
		role: 'Undergraduate student, PI: Prof. Nobuyuki Iwatsuki',
		period: 'Apr. 2023 – Sep. 2023',
		details: [
			'Thesis: Designing and prototyping of a deployable structure for deployable microphone array.',
		],
	},
];

export const skills: SkillGroup[] = [
	{
		category: 'Microfabrication / MEMS',
		items: ['Thin-film process flow design (Sputter, Evaporation, ALD)', 'Photolithography (Mask aligner, Maskless aligner)', 'Etching (Wet etching, Dry etching, ICP-RIE)', 'Measurement (SEM, Laser microscope profiler)', 'Bonding (Plasma activated bonding, Wafer bonding)', 'Device prototyping', 'Packaging-level integration'],
	},
	{
		category: 'Software',
		items: ['C/C++', 'Python', 'MATLAB', 'Adobe', 'KLayout', '3D CAD', 'KiCAD', 'Adobe Illustrator'],
	},
	{
		category: 'Language',
		items: [
			'Korean (Native)',
			'Japanese (Speak, read and write fluently, JLPT N1)',
			'English (Advanced level in speak, read, and write, TOEFL 95 (expired))',
		],		
	},

];

export const publications: PublicationEntry[] = [
    {
        group: 'International Journal Publications',
        authors: 'DongWoo Lee, Byeongwook Jo, Minghao Nie, and Shoji Takeuchi',
        title: '3-Dimensional flexible device for measuring concentric contractile force of in vitro ring-shaped smooth muscle tissue',
        venue: 'Lab on a Chip, 2026',
        note: '(under review)'
    },
    {
        group: 'International Conference Presentations',
        authors: 'DongWoo Lee, Byeongwook Jo, Minghao Nie, and Shoji Takeuchi',
        title: 'Smooth muscle ring on-sensor: Realtime readout of contractions',
        venue: 'The 29th International Conference on Miniaturized Systems for Chemistry and Life Sciences, Adelaide, Australia, Nov. 2-5, 2025',
        note: '(Oral)'
    },
    {
        group: 'International Conference Presentations',
        authors: 'DongWoo Lee, Byeongwook Jo, Minghao Nie, and Shoji Takeuchi',
        title: 'A 3D-printed flexible device for measuring concentric contractile force in in-vitro smooth muscle tissue model',
        venue: 'International Conference on Solid-State Sensors, Actuators and Microsystems (Transducers 2025), Orlando Florida, USA, June 29-July 3, 2025',
        note: '(Oral)'
    },
    {
        group: 'International Conference Presentations',
        authors: 'DongWoo Lee, Byeongwook Jo, Minghao Nie, and Shoji Takeuchi',
        title: 'Fabrication of 3-dimensional variable resistor through 3D-printed flexible device',
        venue: 'International Conference on Biofabrication, Fukuoka, Japan, Nov. 10-13, 2024',
        note: '(Poster)'
    },
    {
        group: 'International Conference Presentations',
        authors: 'DongWoo Lee, Byeongwook Jo, and Shoji Takeuchi',
        title: 'Evaluation of contractile force of ring-shaped smooth muscle tissue using a 3D-printed flexible device',
        venue: 'The 28th International Conference on Miniaturized Systems for Chemistry and Life Sciences, Montreal, Canada, Oct. 13-18, 2024',
        note: '(Poster, Nominated and Final Round)'
    },
    {
        group: 'Domestic Conference Presentations',
        authors: 'LEE DONG WOO, 干場功太郎, 岩附惟行',
        title: '高分解能な音源定位のための展開可能なマイクロホンアレイの設計',
        venue: '第63回人工知能学会AIチャレンジ研究会, pp. 64-70, Nov. 23, 2023',
        note: '(Oral)'
    },
    {
        group: 'Patent',
        authors: 'Lee D., Jo B., Nie M., Takeuchi S.',
        title: '立体柔軟性可変抵抗ピラーを使用した収縮力測定デバイス',
        venue: '特願 2025-167668'
    },
];

export const honors: HonorEntry[] = [
	{
		title: 'SPRING-GX (Support for Pioneering Research Initiated by the Next Generation) Program of the Japan Science and Technology Agency (JST, Overall USD 44,000+)',
		issuer: 'Japan Science and Technology Agency (JST)',
		year: 'Oct. 2025 – Sep. 2028',
	},
	{
		title: 'Degree Conferral Representative, Fall Commencement — selected as departmental representative to receive diploma on stage during the commencement ceremony',
		issuer: 'The University of Tokyo',
		year: 'Sep. 2025',
	},
	{
		title: 'World-leading Innovative Graduate Study Program Co-designing Future Society (WINGS-CFS) — financial support program (Overall USD 20,000+)',
		issuer: 'The University of Tokyo',
		year: 'Jun. 2024 – Sep. 2025',
	},
	{
		title: 'Honjo International Scholarship Foundation — scholarship for foreign students (Overall USD 58,000+)',
		issuer: 'Honjo International Scholarship Foundation',
		year: 'Apr. 2024 – Sep. 2028',
	},
	{
		title: 'Korea–Japan Joint Government Scholarship Program for the Students in Science and Engineering Departments (Overall USD 76,000+)',
		issuer: 'The Government of South Korea and The Government of Japan',
		year: 'Mar. 2017 – Mar. 2020 & Apr. 2022 – Sep. 2023',
	},
];

export const additional: AdditionalEntry[] = [
	{
		organization: 'UTokyo Korean Students Association',
		organizationDetail: '<i>The University of Tokyo, Japan</i>',
		role: 'Steering committee member (General Affair)',
		period: 'Mar. 2026 –',
	},
	{
		organization: 'MicroTAS2025 Invited Seminar Presentation',
		role: 'Presented a conference report on MicroTAS2025, representing the Shoji Takeuchi lab, The University of Tokyo.',
		period: 'Nov. 2025',
	},
	{
		organization: 'UNIST – UTokyo Global Workshop',
		organizationDetail: '<i>Ulsan, Korea</i>',
		role: 'Global Research Institute for Multiscale Biohybrid Systems.',
		detail: 'Presented as a laboratory representative at the UNIST-UTokyo Joint Seminar.',
		period: 'Sep. 2025',
	},
	{
		organization: 'Korea – Japan Summit',
		organizationDetail: '<i>Tokyo, Japan</i>',
		role: 'Media Support Staff',
		detail: 'Involved in the operation of a temporary press center set-up in Tokyo to provide logistical support to the Presidential Travelling Press Corps covering the event.',
		period: 'Aug. 2025',
	},
	{
		organization: 'Tokyo Tech Korean Students Association',
		organizationDetail: '<i>Tokyo Institute of Technology, Japan</i>',
		role: 'Steering committee member',
		detail: 'Planned and promoted social and recruitment events.',
		period: 'Apr. 2018 – Mar. 2020 & Apr. 2022 – Sep. 2023',
	},
	{
		organization: 'Korea – Japan Summit',
		organizationDetail: '<i>Tokyo, Japan</i>',
		role: 'Media Support Staff',
		detail: 'Involved in the operation of a temporary press center set-up in Tokyo to provide logistical support to the Presidential Travelling Press Corps covering the event.',
		period: 'Mar. 2023',
	},
	{
		organization: 'Tascom Co. Ltd',
		organizationDetail: '<i>Gyeonggi-do, South Korea</i>',
		role: 'Intern researcher',
		detail: 'Tasked with a quality control research project.',
		period: 'Dec. 2021 – Jan. 2022',
	},
	{
		organization: 'Military Service, Republic of Korea Army',
		organizationDetail: '<i>South Korea</i>',
		role: 'Sergeant, ROKA 7th Artillery Brigade',
		detail: 'Served and discharged from military service as an artilleryman.',
		period: 'Apr. 2020 – Oct. 2021',
	},
];