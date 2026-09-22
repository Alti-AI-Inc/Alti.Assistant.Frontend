'use client';

import React from 'react';
import FinancialWidget from './FinancialWidget';
import SportsWidget from './SportsWidget';
import RealEstateWidget from './RealEstateWidget';
import SecurityVulnerabilityWidget from './SecurityVulnerabilityWidget';
import AcademicWidget from './AcademicWidget';
import LegalWidget from './LegalWidget';
import MedicalWidget from './MedicalWidget';
import CensusWidget from './CensusWidget';
import SecWidget from './SecWidget';
import ImageWidget from './ImageWidget';

export default function DynamicWidgetRenderer({ metadata }: { metadata?: any }) {
  if (!metadata) return null;

  const domain = metadata.domain;
  const isFinance = !!metadata.financialTicker;
  const isSports = domain === 'sports_odds' || !!metadata.homeTeam;
  const isRealEstate = domain === 'real_estate' || !!metadata.address;
  const isSecurity = domain === 'cisa_kev' || domain === 'nist_nvd_cve' || !!metadata.cveId;
  const isAcademic = domain === 'academic';
  const isLegal = domain === 'legal';
  const isMedical = domain === 'medical';
  const isCensus = domain === 'census_bps';
  const isSec = domain === 'sec_edgar';
  const isImage = domain === 'image_generation';

  return (
    <div className="flex flex-col gap-4 mt-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      {isFinance && <FinancialWidget ticker={metadata.financialTicker} liveData={metadata} />}
      {isSports && <SportsWidget sportsData={metadata} />}
      {isRealEstate && <RealEstateWidget realEstateData={metadata} />}
      {isSecurity && <SecurityVulnerabilityWidget vulnerabilityData={metadata} />}
      {isAcademic && <AcademicWidget academicData={metadata} />}
      {isLegal && <LegalWidget legalData={metadata} />}
      {isMedical && <MedicalWidget medicalData={metadata} />}
      {isCensus && <CensusWidget censusData={metadata} />}
      {isSec && <SecWidget secData={metadata} />}
      {isImage && <ImageWidget imageData={metadata} />}
    </div>
  );
}
