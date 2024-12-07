import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get the screen width
const isTablet = width >= 600; // Define a threshold for tablets (e.g., 600px)

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Increased vertical padding for better spacing
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#888',
    backgroundColor: '#f8f8f8',
    marginBottom: 10, // Added space between header and table rows

  },
  columnHeader: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeaderName: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingStart: 10,
  },
  columnHeaderTxt: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  columnRowTxt: {
    width: '35%', // Adjust column width for responsiveness
    paddingVertical: 10,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
    
  },
  columnRowTxtName: {
    width: '35%', // Adjust column width for responsiveness
    paddingVertical: 10,
    fontSize: 13,
    paddingStart: 10,
    color: '#333',
    fontWeight: '600',
    textAlign: 'start',
    
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    },
  navigationContainerChild: {
    width: isTablet ? "27%" : "23%", // Use 25% if it's a tablet, otherwise 23%
    paddingBottom:5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    
  },
  dropdownContainer: {
    backgroundColor: '#ffffff', // White background
    borderRadius: 8, // Rounded corners for a card-like effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Soft shadow
    shadowRadius: 4,
    padding: 15,
    marginVertical: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    maxWidth: width - 20, // Ensures the dropdown does not exceed the screen width
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  detailColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  labelText: {
    fontSize: 14,
    color: "#808080",
  },
  valueText: {
    fontSize: 14,
    color: "black",
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropdownItemIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    paddingEnd: 20,
  },
  pageButton: {
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageButtonText: {
    fontSize: 14,
    color: '#333',
  },
  pageText: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 10,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 25, // This makes it circular
    backgroundColor: '#F2F2F2', // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:5,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
