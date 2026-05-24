import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import barangaySeal from "../../assets/barangaytuyom.jpg";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://cdn.jsdelivr.net/font-helvetica/1.0/Helvetica.ttf" },
    {
      src: "https://cdn.jsdelivr.net/font-helvetica/1.0/Helvetica-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingLeft: 60,
    paddingRight: 60,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  watermarkView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  watermarkImage: { width: 420, height: 420, opacity: 0.12 },
  mainContentView: { position: "relative", zIndex: 1 },
  headerView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 5,
  },
  logo: { width: 60, height: 60, position: "absolute", top: -5, left: -15 },
  headerText: { fontSize: 10, textAlign: "center", marginBottom: 2 },
  subHeader: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 9,
    textAlign: "center",
    color: "#475569",
    textDecoration: "underline",
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 25,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 5,
  },
  bodyView: {
    fontSize: 12,
    textAlign: "justify",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  bodyParagraph: { marginBottom: 12, textIndent: 30 },
  salutation: { marginBottom: 12, fontWeight: "bold" },
  boldText: { fontWeight: "bold" },
  bottomCluster: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 10,
  },
  signatureGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15,
    width: 180,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "100%",
    paddingBottom: 2,
  },
  signatureTitle: { fontSize: 11, textAlign: "center", marginTop: 4 },
  validityBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 8,
    width: 150,
  },
  validityText: { fontSize: 10, color: "#64748b" },
  photo: {
    width: 95,
    height: 95,
    borderWidth: 1.5,
    borderColor: "#000",
    objectFit: "cover",
    backgroundColor: "#ffffff",
  },
});

export const CertificatePDF = ({ docType, data }) => {
  const activeDocType =
    docType ||
    data?.documentType ||
    data?.document_type ||
    "Certificate of Indigency";
  const safeType = String(activeDocType).trim().toLowerCase();

  const d = {
    name: (data?.fullName || data?.full_name || "[Name]").toUpperCase(),
    age: data?.age || "[Age]",
    purok: data?.purok || "[Purok]",
    purpose: data?.purpose || "[Purpose]",
  };

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();
  const suffix =
    ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] ||
    ["th", "st", "nd", "rd"][day % 100] ||
    "th";

  const renderContent = () => {
    switch (safeType) {
      case "good moral certificate":
        return (
          <View>
            <Text style={styles.bodyParagraph}>
              This is to certify that{" "}
              <Text style={styles.boldText}>{d.name}</Text>,{" "}
              <Text style={styles.boldText}>{d.age}</Text> years of age, is a
              permanent resident of{" "}
              <Text style={styles.boldText}>Purok {d.purok}</Text>, Barangay
              Tuyom, Carcar City, Cebu.
            </Text>
            <Text style={styles.bodyParagraph}>
              This further certifies that the above-named person is a
              law-abiding citizen, possesses{" "}
              <Text style={styles.boldText}>good moral character</Text>, and has
              no pending derogatory record or criminal case filed against them
              in the blotter of this barangay.
            </Text>
            <Text style={styles.bodyParagraph}>
              This certification is being issued upon the request of the
              interested party for{" "}
              <Text style={styles.boldText}>{d.purpose}</Text>.
            </Text>
          </View>
        );
      case "certificate of residency":
        return (
          <View>
            <Text style={styles.bodyParagraph}>
              This is to certify that{" "}
              <Text style={styles.boldText}>{d.name}</Text>,{" "}
              <Text style={styles.boldText}>{d.age}</Text> years of age, is a
              permanent and bonafide resident of{" "}
              <Text style={styles.boldText}>Purok {d.purok}</Text>, Barangay
              Tuyom, Carcar City, Cebu.
            </Text>
            <Text style={styles.bodyParagraph}>
              Records from this office verify that the aforementioned individual
              has been continually residing in the said address and is a
              recognized, peaceful member of our community.
            </Text>
            <Text style={styles.bodyParagraph}>
              This certification is issued upon the request of the
              aforementioned person for{" "}
              <Text style={styles.boldText}>{d.purpose}</Text>.
            </Text>
          </View>
        );
      case "barangay clearance":
        return (
          <View>
            <Text style={styles.bodyParagraph}>
              This is to certify that{" "}
              <Text style={styles.boldText}>{d.name}</Text>,{" "}
              <Text style={styles.boldText}>{d.age}</Text> years of age,
              residing at <Text style={styles.boldText}>Purok {d.purok}</Text>,
              Barangay Tuyom, Carcar City, Cebu, is known to me personally to be
              a person of good standing in this community.
            </Text>
            <Text style={styles.bodyParagraph}>
              Clearance is hereby granted to the said person. Records of this
              office show that there is{" "}
              <Text style={styles.boldText}>
                no pending administrative or criminal charge
              </Text>{" "}
              against the said individual as of this date.
            </Text>
            <Text style={styles.bodyParagraph}>
              Issued for <Text style={styles.boldText}>{d.purpose}</Text> and
              for whatever legal intent it may serve.
            </Text>
          </View>
        );
      case "certificate of business operation":
        return (
          <View>
            <Text style={styles.bodyParagraph}>
              This is to certify that{" "}
              <Text style={styles.boldText}>{d.name}</Text>,{" "}
              <Text style={styles.boldText}>{d.age}</Text> years of age,
              residing at <Text style={styles.boldText}>Purok {d.purok}</Text>,
              is legally operating a lawful business, trade, or livelihood
              within the jurisdiction of Barangay Tuyom, Carcar City, Cebu.
            </Text>
            <Text style={styles.bodyParagraph}>
              This office interposes no objection to the continued operation of
              the said business provided it complies with all existing barangay
              ordinances and municipal laws.
            </Text>
            <Text style={styles.bodyParagraph}>
              This certification is issued upon request for{" "}
              <Text style={styles.boldText}>{d.purpose}</Text>.
            </Text>
          </View>
        );
      default:
        return (
          <View>
            <Text style={styles.bodyParagraph}>
              This is to certify that{" "}
              <Text style={styles.boldText}>{d.name}</Text>,{" "}
              <Text style={styles.boldText}>{d.age}</Text> years of age, is a
              resident of <Text style={styles.boldText}>Purok {d.purok}</Text>,
              Barangay Tuyom, Carcar City, Cebu.
            </Text>
            <Text style={styles.bodyParagraph}>
              Certifies further that he/she belongs to a{" "}
              <Text style={styles.boldText}>low income family</Text> within this
              barangay and lacks the financial capacity to support basic
              necessities.
            </Text>
            <Text style={styles.bodyParagraph}>
              This certification is issued upon the request of the
              above-mentioned name for{" "}
              <Text style={styles.boldText}>{d.purpose}</Text> purposes.
            </Text>
          </View>
        );
    }
  };

  const idImageUrl = data?.idImageUrl || data?.id_picture_url;

  return (
    <Document key={`pdf-${safeType}-${d.name}-${d.purpose}-${Date.now()}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.watermarkView} fixed>
          <Image style={styles.watermarkImage} src={barangaySeal} />
        </View>

        <View style={styles.mainContentView} wrap={false}>
          <View style={styles.headerView}>
            <Image style={styles.logo} src={barangaySeal} />
            <Text style={styles.headerText}>Republic of the Philippines</Text>
            <Text style={styles.headerText}>Province of Cebu</Text>
            <Text style={styles.headerText}>City of Carcar</Text>
            <Text style={styles.headerText}>Barangay Tuyom</Text>
          </View>

          <View style={styles.headerView}>
            <Text style={styles.subHeader}>OFFICE OF THE PUNONG BARANGAY</Text>
            <Text style={styles.contactInfo}>
              0927-5859533 barangaytuyom@gmail.com
            </Text>
          </View>

          <View>
            <Text style={styles.mainTitle}>{activeDocType.toUpperCase()}</Text>
          </View>

          <View style={styles.bodyView}>
            <Text style={styles.salutation}>TO WHOM IT MAY CONCERN:</Text>
            {renderContent()}
            <Text style={{ marginTop: 10 }}>
              Issued this {day}
              {suffix} day of {month} {year} at Barangay Tuyom, Carcar City,
              Cebu, Philippines.
            </Text>
          </View>

          <View style={styles.bottomCluster}>
            <View style={styles.signatureGroup}>
              <Text style={styles.signatureName}>JOSH MARK T. PIODOS</Text>
              <Text style={styles.signatureTitle}>Punong Barangay</Text>
            </View>

            <View style={styles.validityBlock}>
              <Text style={styles.validityText}>Not Valid without</Text>
              <Text style={styles.validityText}>Barangay Seal</Text>
            </View>

            {idImageUrl && <Image style={styles.photo} src={idImageUrl} />}
          </View>
        </View>
      </Page>
    </Document>
  );
};
