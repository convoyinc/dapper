
// import * as subject from '../../../src/transforms/shipment';
// import { ShipmentRequirementDetails, VisualTruckType } from '../../../src/types/shipment';

// const { Shipment } = models;

// describe(`transforms/shipment`, () => {

//   describe(`requirementDetails`, () => {

//     context(`with a minimal shipment`, () => {

//       let details: ShipmentRequirementDetails[];
//       before(() => {
//         details = subject.requirementDetails(new Shipment({
//           requestedTruckTypes: [Truck.Type.DRY_VAN],
//           fullTruckload: true,
//         }));
//       });

//       it(`includes truck details`, () => {
//         const truckDetails = details
//           .find(d => d.type === ShipmentRequirementDetails.Type.TRUCK) as ShipmentRequirementDetails.Truck;

//         expect(truckDetails).to.exist;
//         expect(truckDetails.fullTruckload).to.eq(true);
//         expect(truckDetails.visualTruckTypes).to.deep.eq([VisualTruckType.DRY_VAN]);
//       });

//       it(`has no accessorial details`, () => {
//         const accessorialDetails = details
//           .find(d => d.type === ShipmentRequirementDetails.Type.ACCESSORIALS);
//         expect(accessorialDetails).to.not.exist;
//       });

//     });

//   });

// });
