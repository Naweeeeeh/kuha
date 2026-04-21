import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 50, fontFamily: 'Times-Roman', fontSize: 12, lineHeight: 1.5, position: 'relative' },
    header: { textAlign: 'center', marginBottom: 20 },
    headerText: { fontSize: 11, marginBottom: 2 },
    boldText: { fontFamily: 'Times-Bold', fontSize: 14, marginTop: 10 },
    contactLine: { fontSize: 10, textAlign: 'center', color: '#4a5568', marginBottom: 30, textDecoration: 'underline' },
    title: { fontSize: 20, fontFamily: 'Times-Bold', textAlign: 'center', marginBottom: 30 },
    body: { marginBottom: 30, textAlign: 'justify' },
    paragraph: { marginBottom: 15, textIndent: 40 },
    boldInline: { fontFamily: 'Times-Bold' },
    signatureSection: { marginTop: 40, flexDirection: 'row', justifyContent: 'flex-end' },
    signatureBox: { width: 220, textAlign: 'center' },
    signatureName: { fontFamily: 'Times-Bold', fontSize: 12, textDecoration: 'underline', marginBottom: 2 },
    photoSection: { position: 'absolute', bottom: 50, right: 60, alignItems: 'center' },
    sealText: { fontSize: 9, marginBottom: 5, textAlign: 'center' },
    photoBox: { width: 100, height: 100, border: '1px solid black', justifyContent: 'center', alignItems: 'center' },
    photoImage: { width: '100%', height: '100%', objectFit: 'cover' }
});

export const CertificatePDF = ({ data }) => {
    const { fullName, age, purok, purpose, idImageUrl } = data;

    // Custom format to match "11th day of June 2024"
    const date = new Date();
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 ? 0 : day % 10) - (day % 100 - day % 10 !== 10 ? 0 : 0)] || "th";
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Republic of the Philippines</Text>
                    <Text style={styles.headerText}>Province of Cebu</Text>
                    <Text style={styles.headerText}>City of Carcar</Text>
                    <Text style={styles.headerText}>Barangay TUYOM</Text>
                    <Text style={styles.boldText}>OFFICE OF THE PUNONG BARANGAY</Text>
                </View>
                <Text style={styles.contactLine}>0927-5859533   barangaytuyom@gmail.com</Text>

                <Text style={styles.title}>CERTIFICATE OF INDIGENCY</Text>

                <View style={styles.body}>
                    <Text style={{ marginBottom: 15 }}>To whom it may concern:</Text>

                    <Text style={styles.paragraph}>
                        This is to certify that <Text style={styles.boldInline}>{fullName.toUpperCase()}</Text>, <Text style={styles.boldInline}>{age}</Text> years of age, is a resident of Purok {purok}, Barangay Tuyom, Carcar City, Cebu.
                    </Text>

                    <Text style={styles.paragraph}>
                        Certifies further that he/she belongs to low income family.
                    </Text>

                    <Text style={styles.paragraph}>
                        This certification is issued upon the request of the above-mentioned name for <Text style={styles.boldInline}>{purpose.toLowerCase()}</Text> purposes.
                    </Text>

                    <Text style={styles.paragraph}>
                        Issued this {day}{suffix} day of {month} {year} at Barangay Tuyom, Carcar City, Cebu, Philippines.
                    </Text>
                </View>

                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureName}>Oten Bilat Olok</Text>
                        <Text>Punong Barangay</Text>
                    </View>
                </View>

                <View style={styles.photoSection}>
                    <Text style={styles.sealText}>Not Valid without{"\n"}Barangay Seal</Text>
                    {idImageUrl ? (
                        <Image source={idImageUrl} style={styles.photoBox} />
                    ) : (
                        <View style={styles.photoBox}>
                            <Text style={{ fontSize: 10, color: '#666' }}>2x2 Picture</Text>
                        </View>
                    )}
                </View>

            </Page>
        </Document>
    );
};