/**
 * Uganda Location Selector Library
 * Author: Allan Tumuhimbise
 * Version: 1.0.4
 * 
 * A comprehensive JavaScript library for hierarchical location selection in Uganda,
 * built from official Uganda Electoral Commission data.
 * 
 * Features:
 * - 222 Districts (complete coverage)
 * - 427 Constituencies
 * - 1,881 Sub-counties  
 * - 3,454 Electoral Areas
 * - Free geocoding integration with Nominatim API
 */

class UgandaLocationSelector {
    constructor() {
        this.data = null;
        this.initialized = false;
    }

    /**
     * Initialize the selector by loading electoral data
     * Must be called before using other methods
     */
    async init() {
        try {
            // In browser environment, fetch the data file
            if (typeof window !== 'undefined') {
                const response = await fetch('./uganda_electoral_data.json');
                this.data = await response.json();
            } 
            // In Node.js environment, require the data file
            else {
                const fs = require('fs');
                const path = require('path');
                const dataPath = path.join(__dirname, 'uganda_electoral_data.json');
                const rawData = fs.readFileSync(dataPath, 'utf8');
                this.data = JSON.parse(rawData);
            }
            
            this.initialized = true;
            console.log('Uganda Location Selector initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Uganda Location Selector:', error);
            throw error;
        }
    }

    /**
     * Check if the selector is initialized
     */
    _checkInitialized() {
        if (!this.initialized) {
            throw new Error('UgandaLocationSelector must be initialized first. Call await selector.init()');
        }
    }

    /**
     * Get all districts in Uganda
     * @returns {Array<{name: string, code: string}>} Array of district objects
     */
    getDistricts() {
        this._checkInitialized();
        
        return this.data.districts.map(district => ({
            name: district.name,
            code: district.code
        }));
    }

    /**
     * Get constituencies for a specific district
     * @param {string} districtCode - District code (e.g., "027" for Mbarara)
     * @returns {Array<{name: string, code: string}>} Array of constituency objects
     */
    getConstituencies(districtCode) {
        this._checkInitialized();
        
        if (!districtCode) {
            return [];
        }

        const district = this.data.districts.find(d => d.code === districtCode);
        if (!district) {
            console.warn(`District with code ${districtCode} not found`);
            return [];
        }

        return district.constituencies.map(constituency => ({
            name: constituency.name,
            code: constituency.code
        }));
    }

    /**
     * Get sub-counties for a specific constituency
     * @param {string} districtCode - District code
     * @param {string} constituencyCode - Constituency code
     * @returns {Array<{name: string, code: string}>} Array of sub-county objects
     */
    getSubCounties(districtCode, constituencyCode) {
        this._checkInitialized();
        
        if (!districtCode || !constituencyCode) {
            return [];
        }

        const district = this.data.districts.find(d => d.code === districtCode);
        if (!district) {
            console.warn(`District with code ${districtCode} not found`);
            return [];
        }

        const constituency = district.constituencies.find(c => c.code === constituencyCode);
        if (!constituency) {
            console.warn(`Constituency with code ${constituencyCode} not found in district ${districtCode}`);
            return [];
        }

        return constituency.subcounties.map(subcounty => ({
            name: subcounty.name,
            code: subcounty.code
        }));
    }

    /**
     * Get electoral areas for a specific sub-county
     * @param {string} districtCode - District code
     * @param {string} constituencyCode - Constituency code
     * @param {string} subCountyCode - Sub-county code
     * @returns {Array<{name: string, code: string}>} Array of electoral area objects
     */
    getElectoralAreas(districtCode, constituencyCode, subCountyCode) {
        this._checkInitialized();
        
        if (!districtCode || !constituencyCode || !subCountyCode) {
            return [];
        }

        const district = this.data.districts.find(d => d.code === districtCode);
        if (!district) {
            console.warn(`District with code ${districtCode} not found`);
            return [];
        }

        const constituency = district.constituencies.find(c => c.code === constituencyCode);
        if (!constituency) {
            console.warn(`Constituency with code ${constituencyCode} not found in district ${districtCode}`);
            return [];
        }

        const subcounty = constituency.subcounties.find(s => s.code === subCountyCode);
        if (!subcounty) {
            console.warn(`Sub-county with code ${subCountyCode} not found in constituency ${constituencyCode}`);
            return [];
        }

        return subcounty.electoral_areas.map(area => ({
            name: area.name,
            code: area.code
        }));
    }

    /**
     * Get geographic coordinates for a location using Nominatim API
     * @param {string} locationName - Location name (e.g., "Mbarara, Uganda")
     * @returns {Promise<{lat: number, lon: number, display_name: string}>} Coordinates object
     */
    async getCoordinates(locationName) {
        if (!locationName) {
            throw new Error('Location name is required');
        }

        try {
            const encodedLocation = encodeURIComponent(locationName);
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const result = data[0];
                return {
                    lat: parseFloat(result.lat),
                    lon: parseFloat(result.lon),
                    display_name: result.display_name
                };
            } else {
                throw new Error(`No coordinates found for location: ${locationName}`);
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            throw error;
        }
    }

    /**
     * Get complete location hierarchy for a specific electoral area
     * @param {string} districtCode - District code
     * @param {string} constituencyCode - Constituency code
     * @param {string} subCountyCode - Sub-county code
     * @param {string} electoralAreaCode - Electoral area code
     * @returns {Object} Complete location hierarchy
     */
    getLocationHierarchy(districtCode, constituencyCode, subCountyCode, electoralAreaCode) {
        this._checkInitialized();
        
        const district = this.data.districts.find(d => d.code === districtCode);
        if (!district) return null;

        const constituency = district.constituencies.find(c => c.code === constituencyCode);
        if (!constituency) return null;

        const subcounty = constituency.subcounties.find(s => s.code === subCountyCode);
        if (!subcounty) return null;

        const electoralArea = subcounty.electoral_areas.find(a => a.code === electoralAreaCode);
        if (!electoralArea) return null;

        return {
            district: { name: district.name, code: district.code },
            constituency: { name: constituency.name, code: constituency.code },
            subCounty: { name: subcounty.name, code: subcounty.code },
            electoralArea: { name: electoralArea.name, code: electoralArea.code }
        };
    }

    /**
     * Search locations by name (case-insensitive)
     * @param {string} searchTerm - Search term
     * @param {string} level - Level to search ('district', 'constituency', 'subcounty', 'electoral_area')
     * @returns {Array} Array of matching locations with hierarchy
     */
    searchLocations(searchTerm, level = 'all') {
        this._checkInitialized();
        
        if (!searchTerm) return [];
        
        const results = [];
        const term = searchTerm.toLowerCase();

        this.data.districts.forEach(district => {
            // Search districts
            if ((level === 'district' || level === 'all') && 
                district.name.toLowerCase().includes(term)) {
                results.push({
                    type: 'district',
                    district: { name: district.name, code: district.code }
                });
            }

            district.constituencies.forEach(constituency => {
                // Search constituencies
                if ((level === 'constituency' || level === 'all') && 
                    constituency.name.toLowerCase().includes(term)) {
                    results.push({
                        type: 'constituency',
                        district: { name: district.name, code: district.code },
                        constituency: { name: constituency.name, code: constituency.code }
                    });
                }

                constituency.subcounties.forEach(subcounty => {
                    // Search sub-counties
                    if ((level === 'subcounty' || level === 'all') && 
                        subcounty.name.toLowerCase().includes(term)) {
                        results.push({
                            type: 'subcounty',
                            district: { name: district.name, code: district.code },
                            constituency: { name: constituency.name, code: constituency.code },
                            subCounty: { name: subcounty.name, code: subcounty.code }
                        });
                    }

                    subcounty.electoral_areas.forEach(area => {
                        // Search electoral areas
                        if ((level === 'electoral_area' || level === 'all') && 
                            area.name.toLowerCase().includes(term)) {
                            results.push({
                                type: 'electoral_area',
                                district: { name: district.name, code: district.code },
                                constituency: { name: constituency.name, code: constituency.code },
                                subCounty: { name: subcounty.name, code: subcounty.code },
                                electoralArea: { name: area.name, code: area.code }
                            });
                        }
                    });
                });
            });
        });

        return results;
    }

    /**
     * Get statistics about the dataset
     * @returns {Object} Dataset statistics
     */
    getStatistics() {
        this._checkInitialized();
        
        let totalConstituencies = 0;
        let totalSubCounties = 0;
        let totalElectoralAreas = 0;

        this.data.districts.forEach(district => {
            totalConstituencies += district.constituencies.length;
            
            district.constituencies.forEach(constituency => {
                totalSubCounties += constituency.subcounties.length;
                
                constituency.subcounties.forEach(subcounty => {
                    totalElectoralAreas += subcounty.electoral_areas.length;
                });
            });
        });

        return {
            districts: this.data.districts.length,
            constituencies: totalConstituencies,
            subCounties: totalSubCounties,
            electoralAreas: totalElectoralAreas
        };
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { UgandaLocationSelector };
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.UgandaLocationSelector = UgandaLocationSelector;
}
