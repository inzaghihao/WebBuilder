// *
// *
export function PageParam(target, name, descriptor) {
    let sourceFunction = descriptor.value
    descriptor.value = function() {
        // ************************* 侧边栏控制
        this.sideShow = true
        this.sideList = [
            { name: '员工管理', id: 0 },
            { name: '库存管理', id: 1 },
            { name: '开单', id: 3 },
            { name: '订单列表', id: 2 },
        ]
        this.sideIndex = -1
        // ************************* 店铺弹窗控制
        this.shopList = []
        this.shopWorkInList = []
        this.shopModalShow = false
        // ************************* 仓库弹窗控制
        this.houseList = []
        this.houseModalShow = false
        // *
        sourceFunction.apply(this, arguments)
    }
}
// *
// *
import { getShopList, createShop, getHouseList, createHouse } from '@/webapps/sjAdmin/views/api.js'
export function PageFunc(TargetClass) {
    TargetClass.prototype.setSideIndex = setSideIndex
    //
    TargetClass.prototype.toggleShopModal = toggleShopModal
    TargetClass.prototype.pickShop = pickShop
    TargetClass.prototype.createMyShop = createMyShop
    //
    TargetClass.prototype.toggleHouseModal = toggleHouseModal
    TargetClass.prototype.pickHouse = pickHouse
    TargetClass.prototype.createMyHouse = createMyHouse
}
// * 侧边栏点击项目
function setSideIndex(index) {
    // 任何 Side 都需要登录
    if (!this.iAmLogined()) return

    // 所有选项必须有店铺信息
    if (window.$store.state.shopInfo._id === -1) {
        $tip('请选择店铺')
        this.toggleShopModal() // ASYNC
        return
    }

    // 仓库管理 开单 订单管理必须选择了仓库
    let indexCharge = index === 1 || index === 2 || index === 3
    if (indexCharge && window.$store.state.houseInfo._id === -1) {
        $tip('请选择仓库')
        this.toggleHouseModal() // ASYNC
        return
    }

    // *
    this.sideIndex = index
}
// * 店铺
async function toggleShopModal() {
    if (this.shopModalShow === true) {
        this.shopModalShow = false
        return
    }
    // *
    try {
        $load.show()
        // 店铺列表
        let data = await getShopList()
        this.shopList = Object.assign([], data.shopList)
        this.shopWorkInList = Object.assign([], data.officeList)

        // end
        $load.hide()
        this.shopModalShow = true
        this.sideIndex = -1
    } catch (error) {
        $common.loadToastWarn(error)
    }
}
function pickShop(shop) {
    window.$store.commit('initShopInfo', shop)
    window.$store.commit('clearHouseInfo')
    this.toggleShopModal()
}
// * 创建店铺
async function createMyShop() {
    try {
        $load.show()
        await createShop()

        // 创建的店铺列表
        let data = await getShopList()
        this.shopList = Object.assign([], data.shopList)

        //
        $load.hide()
    } catch (error) {
        $common.loadToastWarn(error)
    }
}
// * 仓库
async function toggleHouseModal() {
    if (this.houseModalShow === true) {
        this.houseModalShow = false
        return
    }
    // *
    try {
        $load.show()
        // 创建的仓库列表
        let shopInfo = window.$store.state.shopInfo
        if (shopInfo._id === -1) throw new Error('请先选择店铺')
        let list = await getHouseList(shopInfo._id)
        this.houseList = Object.assign([], list)

        // end
        $load.hide()
        this.houseModalShow = true
        this.sideIndex = -1
    } catch (error) {
        $common.loadToastWarn(error)
    }
}
function pickHouse(house) {
    window.$store.commit('initHouseInfo', house)
    this.toggleHouseModal()
}
async function createMyHouse() {
    try {
        $load.show()
        let shopInfo = window.$store.state.shopInfo
        await createHouse(shopInfo._id)

        // 创建的店铺列表
        let list = await getHouseList(shopInfo._id)
        this.houseList = Object.assign([], list)

        //
        $load.hide()
    } catch (error) {
        $common.loadToastWarn(error)
    }
}