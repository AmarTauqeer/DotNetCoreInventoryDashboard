using DotNetCoreInventoryDashboard.dtos.PurchaseDetail;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class PurchaseDetailRepository(models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB) : IPurchaseDetail
    {
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        public async Task<PurchaseDetail> CreateAsync(PurchaseDetail purchaseDetail)
        {
            await _db.PurchaseDetails.AddAsync(purchaseDetail);
            await _db.SaveChangesAsync();
            return purchaseDetail;
        }

        public async Task<PurchaseDetail?> DeleteAsync(int purchaseMasterId)
        {
            //Console.WriteLine("Id = " + saleMasterId);
            // fetch all
            List<PurchaseDetail> purchaseDetails = await _db.PurchaseDetails.ToListAsync();



            PurchaseDetail filterPurchaseDetail = await _db.PurchaseDetails.FirstOrDefaultAsync(s => s.PurchaseMasterId == purchaseMasterId);
            //Console.WriteLine(filterSaleDetail);
            if (filterPurchaseDetail != null)
            {
                await _db.PurchaseDetails.Where(s => s.PurchaseMasterId == purchaseMasterId).ExecuteDeleteAsync();
                return filterPurchaseDetail;
            }
            else
            {
                //Console.WriteLine("hi");
                return null;
            }
        }

        public async Task<List<PurchaseDetail>> GetAllAsync()
        {
            return await _db.PurchaseDetails.ToListAsync();
        }

        public async Task<PurchaseDetail?> GetByIdAsync(int id)
        {
            return await _db.PurchaseDetails.FindAsync(id);
        }

        public async Task<PurchaseDetail> UpdateAsync(int id, CreateUpdatePurchaseDetailDto createUpdatePurchaseDetailDto)
        {
            var purchaseDetail = await _db.PurchaseDetails.FirstOrDefaultAsync(x => x.PurchaseMasterId == id);
            if (purchaseDetail == null)
            {
                return null;
            }
            purchaseDetail.PurchaseMasterId = id;
            purchaseDetail.ProductId = createUpdatePurchaseDetailDto.ProductId;
            purchaseDetail.Qty = createUpdatePurchaseDetailDto.Qty;
            purchaseDetail.Rate = createUpdatePurchaseDetailDto.Rate;
            purchaseDetail.AmountPerProduct = createUpdatePurchaseDetailDto.AmountPerProduct;
            await _db.SaveChangesAsync();
            return purchaseDetail;
        }
    }
}
